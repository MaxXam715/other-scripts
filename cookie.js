// Устанавливаем куки
function setCookie(name, value, expires = "infinite") {
    // проверка данных
    if (!value) {
        console.error('%c ERROR: set Cookie ', 'background: red; color: #fff; border-radius: 50px;', "Нет данных для сохранения");
        return false;
    } else if (typeof value == "object") {
        value = JSON.stringify(value);
    }

    // проверка имени
    if (!name) {
        console.error('%c ERROR: set Cookie ', 'background: red; color: #fff; border-radius: 50px;', "Отсутствует название");
        return false;
    }
    // проверка срока жизни
    if (expires) {
        if (typeof expires == "string" && expires === "infinite") {
            expires = new Date(Date.now() + 700 * 864e5).toUTCString();
        } else if (typeof expires == "number") {
            let currentDate = new Date();
            currentDate.setTime(currentDate.getTime() + (expires * 1000));
            expires = currentDate.toUTCString();
        }
    } else {
        console.error('%c ERROR: set Cookie ', 'background: red; color: #fff; border-radius: 50px;', "Отсутствует время");
        return false;
    }

    document.cookie = `${name}=${value}; expires=${expires}; path=/;`;
}

// Получаем куки
function getCookie(cookieName) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${cookieName}=`);

    if (parts.length === 2) {
        let res = parts.pop().split(';').shift();

        // Попробуем распарсить как JSON
        try {
            return JSON.parse(res);
        } catch (error) {
            console.error(`Ошибка парсинга куки "${cookieName}":`, error);
            // Вернем не парсированный результат (строку)
            return res;
        }
    }

    // Если кука не найдена, вернем null
    return null;
}

// Удаляем куки
function deleteCookie(nameCookie) {
    // Получите все cookie текущего документа
    var cookies = document.cookie.split(";");

    // Переберите все cookie и найдите нужное
    for (var i = 0; i < cookies.length; i++) {
        var cookieParts = cookies[i].split("="),
            cookieName = cookieParts[0].trim();

        if (cookieName === nameCookie) {
            document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            if (document.querySelector('.Pl-plugin-errors-widget')) {
                document.querySelector('.Pl-plugin-errors-widget').remove();
            }

            break;
        }
    }
}