/**
 * Маска для денег
 * @param {string} number число
 * @param {number} min мин. кол-во символов после запятой
 * @param {number} max макс. кол-во символов после запятой
 * @return 120 000 Р.
 */
function maskForMoney(number, min, max) {
    number = parseFloat(number);
    return number.toLocaleString("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: (!min) ? 0 : min,
        maximumFractionDigits: (!max) ? 2 : max,
    }) || "NaN";
}