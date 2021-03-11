import * as markdown from "./markdown.js";
import * as server from "./server.js";
import * as title from "./title.js";
import * as nav from "./nav.js";
window.onload = main;
function main() {
    /* 先监听事件，再让子iframe激活事件 */
    window.addEventListener('message', function (e) {
        switch (e.data) {
            case "read":
                write();
                break;
            case "end":
                // @ts-ignore
                document.getElementById("loading").style.display = "none";
                // @ts-ignore
                document.getElementById("main").style.display = "";
                opt();
                break;
        }
    });
    let ifr = document.getElementById("markdown");
    // @ts-ignore
    ifr.src = ifr.dataset.src;
}
function write() {
    function Callback(callback) {
        markdown.url_get_which_file_download_url(url => {
            if (url === "")
                return callback("", "## 未找到文件");
            server.GET(url, (resp) => {
                resp = resp.replace(/\n\n\n\n/g, `\n\n<br class="null">\n\n`);
                callback(url, resp);
            });
        });
    }
    Callback(function (download_url, text) {
        let ifr = document.getElementById("markdown");
        const data = { http_url: download_url, markdown_source: text };
        // @ts-ignore
        ifr.contentWindow.postMessage(data, ifr.src);
    });
}
function opt() {
    title.update();
    nav.update();
}
