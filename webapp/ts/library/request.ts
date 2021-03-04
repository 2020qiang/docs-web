interface responseT {
    code: number
    text: string
}

function GET(url: string): responseT {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    return {
        code: xhr.status,
        text: xhr.responseText,
    };
}

export {
    GET,
    responseT,
}
