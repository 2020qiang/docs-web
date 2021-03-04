import * as localstorage from "./localstorage.js";
function GET(url) {
    return localstorage.cache(decodeURI(url), function () {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.send();
        return xhr.responseText;
    });
}
export { GET, };
