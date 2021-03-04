function css(url: string, onload: Function): void {
    let t = document.createElement('link');
    t.type = 'text/css';
    t.rel = 'stylesheet';
    t.href = url;
    t.onload = function () {
        onload()
    };
    document.getElementsByTagName('head')[0].appendChild(t);
}

function css_remove_all(): void {
    const length = document.getElementsByTagName("link").length;
    for (let i = length - 1; i >= 0; i--) {
        let ele = document.getElementsByTagName('link')[i];
        if (ele.parentNode !== null) ele.parentNode.removeChild(ele);
    }
}

/*
 * https://www.codenong.com/10113366/
 */
function js(url: string, onload: Function): void {
    let t = document.createElement('script');
    t.type = 'text/javascript';
    t.src = url;
    t.onload = function () {
        onload();
    };
    document.getElementsByTagName('body')[0].appendChild(t);
}

export {
    css,
    css_remove_all,
    js,
}
