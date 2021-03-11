function http_request(url, callback) {
    fetch(url)
        .then(resp => resp.text())
        .then(resp => callback(resp))
        .catch(error => alert(error));
}
function cache_is_exist(key) {
    let v1 = localStorage.getItem(key);
    let v2 = localStorage.getItem(key + ".timestamp");
    return v1 !== null && v2 !== null;
}
function cache_is_old(key) {
    let v = localStorage.getItem(key + ".timestamp");
    if (v === null)
        return true;
    const now = Math.floor(Date.now() / 1000);
    return Number(v) + (60 * 60 * 24 * 15) < now; /* 15天 */
}
function GET(url, callback) {
    url = decodeURI(url);
    /*
     * 1. 存在缓存
     * 2. 缓存在有效期内
     */
    if (cache_is_exist(url) && !cache_is_old(url)) {
        let v = localStorage.getItem(url);
        if (v !== null)
            callback(v);
        return;
    }
    /* 否则更新缓存 */
    http_request(url, function (resp) {
        localStorage.setItem(url, resp);
        localStorage.setItem(url + ".timestamp", Math.floor(Date.now() / 1000).toString());
        callback(resp);
    });
}
export { GET, };
