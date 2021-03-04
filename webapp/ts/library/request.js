function GET(url) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    return {
        code: xhr.status,
        text: xhr.responseText,
    };
}
export { GET, };
