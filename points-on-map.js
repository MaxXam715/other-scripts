import locationModal from './locationModal.js'

export default function location(content) {
    var locationHTML = document.createElement("section");
    locationHTML.classList.add("location-section");
    locationHTML.setAttribute("anchor-id", "location");
    var location = `
    <div class="G-container">
        <div class="G-card-aspect">
            <h3 class="block-small-header">${content.contents.title.value}</h3>
            <div class="list-categories">`;
    for (var i in arrayCategories) {
        var category = arrayCategories[i];
        location += `
                    <button type="button" class="btn btn-category-item" data-category="${category.category}">
                        <i class="icon ${category.icon}"></i>
                        <span class="title">${category.title}</span>
                    </button>`;
    }
    location += `
            </div>
            <div class="map-container" id="map-container"></div>
        </div>
    </div>`;
    locationHTML.innerHTML = location;
    document.getElementById("app").append(locationHTML);

    var btnCategories = locationHTML.querySelectorAll(".list-categories .btn-category-item"),
        myMap,
        pointCollection;

    ymaps.ready(initMap);

    // выбираем категорию, которая будет отображаться на карте
    btnCategories.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var category;

            if (this.classList.contains("active")) {
                btn.classList.remove("active");
            } else {
                category = this.getAttribute("data-category");

                btnCategories.forEach(function (btn) {
                    btn.classList.remove("active");
                });
                btn.classList.add("active");

                var foundObject = arrayCategories.find(function(obj) {
                    return obj.category == category;
                });

                category = [foundObject];
            }

            outputCategory(category);
        });
    });

    // Создание карты
    function initMap() {
        myMap = new ymaps.Map(locationHTML.querySelector("#map-container"), {
            center: [55.789320, 37.497826],
            zoom: 14,
            controls: []
        }, {
            suppressMapOpenBlock: true
        });

        if (/Mobile/i.test(navigator.userAgent)) {
            myMap.behaviors.disable('scrollZoom');
            myMap.behaviors.disable('drag');
        }

        // Задаем стиль метки (метка в виде круга).
        var placemark = new ymaps.Placemark([55.789320, 37.497826], {}, {
            preset: "islands#circleDotIcon",
            iconLayout: 'default#image',
            iconImageHref: "/assets/img/map/project.svg",
            iconImageSize: [48, 48],
            zIndex: 150
        });
        myMap.geoObjects.add(placemark);

        fullScreenBtn(); // кнопка "Развернуть на весь экран"
        customZoomBtn(); // кастомные кнопки зума
    }

    // кнопка открыть карту на весь экран
    function fullScreenBtn() {
        var btnHTML = document.createElement("button");
        btnHTML.classList.add("btn");
        btnHTML.classList.add("fullscreen-btn");
        btnHTML.setAttribute("type", "button");
        btnHTML.innerHTML = `<i class="icon arrows-out"></i>`;
        locationHTML.querySelector(".map-container").append(btnHTML);

        // Подключение обработчиков событий для кнопок зума
        btnHTML.addEventListener("click", function() {
            locationModal();
        });
    }

    // кастомные кнопки зума
    function customZoomBtn() {
        var zoomHTML = document.createElement("div");
        zoomHTML.classList.add("custom-zoom-btn");
        zoomHTML.innerHTML = `
        <button type="button" class="btn btn-zoom zoom-plus"><i class="icon plus"></i></button>
        <button type="button" class="btn btn-zoom zoom-minus"><i class="icon minus"></i></button>`;
        locationHTML.querySelector(".map-container").append(zoomHTML);

        // Подключение обработчиков событий для кнопок зума
        locationHTML.querySelector(".zoom-plus").addEventListener("click", function() {
            myMap.setZoom(myMap.getZoom() + 1, {duration: 300});
        });

        locationHTML.querySelector(".zoom-minus").addEventListener("click", function() {
            myMap.setZoom(myMap.getZoom() - 1, {duration: 300});
        });
    }

    // вывод категорий на карту
    function outputCategory(category) {
        // если на карте уже есть точки, то чистим их, перед тем как вывести новые точки
        if (pointCollection !== undefined) pointCollection.removeAll();

        // если категории нет, то удаляем все точки
        if (category === undefined) return false;

        // Создаем коллекцию точек
        pointCollection = new ymaps.GeoObjectCollection();

        // добавляем в коллекцию точки из категории
        var placemark;
        for (var i in category) {
            for (var c in category[i].points) {
                var point = category[i].points[c];

                // выводим кастомную метку категории
                var MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
                    `<div class="bs-point-custom" data-id="${point.lat}">
                    <div class="icon-container">
                        <i class="icon ${category[i].icon}"></i>
                    </div>
                    <p class="title">${point.title}</p>
                </div>`);

                placemark = new ymaps.Placemark([point.lat, point.lot], {
                    iden: point.lat,
                }, {
                    iconLayout: "default#imageWithContent",
                    iconImageHref: '',
                    iconImageSize: [48, 48],
                    iconImageOffset: [-48, -48],
                    iconContentOffset: [0, 0],
                    zIndex: 2,
                    iconContentLayout: MyIconContentLayout
                });

                // наводим мышку на точку
                placemark.events.add('mouseenter', function (e) {
                    var targetPlacemark = e.get('target');
                    var id_point = targetPlacemark.properties.get('iden');
                    locationHTML.querySelector(".bs-point-custom[data-id='"+id_point+"']").classList.add('hover');
                });

                // убираем мышку с точки
                placemark.events.add('mouseleave', function (e) {
                    var targetPlacemark = e.get('target');
                    var id_point = targetPlacemark.properties.get('iden');
                    locationHTML.querySelector(".bs-point-custom[data-id='"+id_point+"']").classList.remove('hover');
                });

                pointCollection.add(placemark);
            }
        }

        // Устанавливаем коллекцию точек на карту
        myMap.geoObjects.add(pointCollection);
    }
}