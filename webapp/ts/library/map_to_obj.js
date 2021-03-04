/* https://stackoverflow.com/questions/44740423/create-json-string-from-js-map-and-string */
function mapToObj(map) {
    let obj = {};
    map.forEach(function (v, k) {
        obj[k] = v;
    });
    return obj;
}
export { mapToObj, };
