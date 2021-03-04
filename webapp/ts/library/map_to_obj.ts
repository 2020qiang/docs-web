/* https://stackoverflow.com/questions/44740423/create-json-string-from-js-map-and-string */
function mapToObj(map: Map<string, string>): any {
    let obj: any = {};
    map.forEach(function (v, k) {
        obj[k] = v;
    })
    return obj;
}

export {
    mapToObj,
}
