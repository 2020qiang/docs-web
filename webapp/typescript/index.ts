import * as markdown from "./markdown.js"
import * as http_get_sync from "./http_get_sync.js"
import * as title from "./title.js"
import * as nav from "./nav.js"


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
            main();
            break;
    }
});

function write() {
    const download_url = markdown.url_get_which_file_download_url();
    let text: string;
    if (download_url === "") {
        text = "## 未找到文件"
    } else {
        text = http_get_sync.GET(download_url);
        text = text.replace(/\n\n\n\n/g, `\n\n<br class="null">\n\n`);
    }

    let ifr = document.getElementById("markdown");
    const data = {http_url: download_url, markdown_source: text};
    // @ts-ignore
    ifr.contentWindow.postMessage(data, ifr.src);
}

function main() {
    title.update();
    nav.update();
}
