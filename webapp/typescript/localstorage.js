/* 时间戳小于15天,表示数据太老了 */
function is_old(key) {
    let v = localStorage.getItem(key + ".timestamp");
    if (v === null)
        return true;
    const now = Math.floor(Date.now() / 1000);
    return Number(v) + (60 * 60 * 24 * 15) < now;
}
/* 是否存在缓存 */
function is_exist(key) {
    let v1 = localStorage.getItem(key);
    let v2 = localStorage.getItem(key + ".timestamp");
    return v1 !== null && v2 !== null;
}
/* 写入新缓存 */
function write_new_cache(key, text) {
    localStorage.setItem(key, text);
    localStorage.setItem(key + ".timestamp", Math.floor(Date.now() / 1000).toString());
}
function cache(key, fetch) {
    key = "cache." + key;
    if (!is_exist(key)) {
        const fetch_value = fetch();
        if (fetch_value === undefined)
            return "";
        write_new_cache(key, fetch_value);
        return fetch_value;
    }
    if (is_old(key)) {
        const fetch_value = fetch();
        if (fetch_value === undefined)
            return "";
        write_new_cache(key, fetch_value);
        return fetch_value;
    }
    const v = localStorage.getItem(key);
    if (v === null)
        return "";
    return v;
}
export { cache, };
