export default class Router {
    #rootElement;
    #routerLinks;
    #pageName;
    #paths;
    #page;
    #lastPage;
    #devMode;

    constructor() {
        this.rootElement = document.getElementById('app');
        this.routerLinks = this.listRouterLinks();
        this.pageUrl = document.location.pathname+window.location.search;
        this.page = "";
        this.lastPage = "";

        this.init();
    }

    init() {
        this.openPage(this.pageUrl);

        document.addEventListener("click", (e) => {
            let target = e.target;

            // Проверяем, является ли кликнутый элемент тегом <a> или его дочерним элементом
            while (target && target.tagName.toLowerCase() !== 'a') {
                target = target.parentElement; // Поднимаемся вверх по дереву элементов
            }

            if (target && target.tagName.toLowerCase() === 'a') {
                const href = target.getAttribute('href');

                // Проверяем, является ли ссылка локальной
                if (href && (href.startsWith('/') || href === '/')) {
                    e.stopPropagation();
                    e.preventDefault();

                    if (target.innerHTML.trim()) {
                        if (this.lastPage && this.lastPage !== href) {
                            history.pushState(href, '', href);
                        }

                        this.openPage(href);
                    }
                }
            }
        });

        // Обработка перехода назад (или вперед) по истории
        window.onpopstate = (event) => {    //стрелка back
            let prevPage = document.location.pathname+window.location.search;
            this.openPage(prevPage);
        };
    }

    async openPage(url) {
        url = url.includes('?') ? url.split('?')[0] : url;

        let route = this.matchRoute(url);

        if (route) {
            this.lastPage = route.page;
        } else {
            route = {page: "404"}
        }

        document.head.querySelectorAll('link[router], link[id]').forEach((link) => {
            link.remove();
        });

        document.body.className = '';
        this.rootElement.innerHTML = ``;
        window.scrollTo(0, 0);

        await this.createCSSLink(route.page);
        this.importComponent(route.page);
    }

    matchRoute(url) {
        for (const route of this.routerLinks) {
            const pathPattern = route.path.replace(/{:[^}]+}/g, "([^/]+)");
            const regex = new RegExp(`^${pathPattern}$`);

            if (regex.test(url)) {
                return route;
            }
        }
        return null;
    }

    importComponent(path) {
        import(`/pages/${path}/${path}.js?v=${version}`).then(function (obj) {
            obj.default();
        }).catch(function (error) {
            console.error('%c ERROR: import JS ', 'background: red; color: #fff; border-radius: 50px;', path, error);
        });
    }

    createCSSLink(path) {
        return new Promise((resolve, reject) => { // Возвращаем промис
            let nameFile = path;

            let cssNavigation = document.createElement('link');
            cssNavigation.setAttribute("rel", "stylesheet");
            cssNavigation.setAttribute("href", "/pages/" + path + "/css/" + path + ".css?v=" + version);
            cssNavigation.setAttribute("router", nameFile);
            cssNavigation.id = "css_" + nameFile;

            cssNavigation.onload = () => {
                resolve(); // Разрешаем промис при успешной загрузке
            };

            cssNavigation.onerror = () => {
                reject(new Error(`Failed to load CSS: ${cssNavigation.href}`)); // Отклоняем промис при ошибке
            };

            if (!document.getElementById(cssNavigation.id)) {
                document.head.append(cssNavigation);
            } else {
                resolve(); // Если CSS уже загружен, сразу разрешаем промис
            }
        });
    }

    listRouterLinks() {
        return [
            {
                page: "home",
                path: "/",
            },
            {
                page: "developer",
                path: "/developer",
            },
            {
                page: "concept",
                path: "/concept",
            },
            {
                page: "developer",
                path: "/developer",
            },
            {
                page: "book",
                path: "/book",
            },
            {
                page: "privacyPolicy",
                path: "/privacy-policy",
            },
            {
                page: "catalog",
                path: "/catalog",
            },
            {
                page: "flat",
                path: "/catalog/{:id_flat}",
            },
            {
                page: "favorites",
                path: "/favorites",
            },
            {
                page: "genplan",
                path: "/genplan",
            },
            {
                page: "floor-selection",
                path: "/floor-selection",
            },
            {
                page: "media",
                path: "/media",
            },
            {
                page: "mediaDetails",
                path: "/media-details",
            },
            {
                page: "constructionDetails",
                path: "/construction-details",
            },
            {
                page: "pantries",
                path: "/pantries",
            },
            {
                page: "purchase-methods",
                path: "/purchase-methods",
            },
            {
                page: "contact",
                path: "/contact",
            },
            {
                page: "404",
                path: "",
            },
        ];
    }
}