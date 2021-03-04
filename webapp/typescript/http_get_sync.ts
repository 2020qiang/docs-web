import * as localstorage from "./localstorage.js"

function GET(url: string): string {
    return localstorage.cache(decodeURI(url), function (): string {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.send();
        return xhr.responseText
    });
}

export {
    GET,
}
