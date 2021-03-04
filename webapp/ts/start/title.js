import * as config from "../json/config.js";
import * as name from "../library/name.js";
import * as github from "../method/github.js";
function init() {
    /* 首页 */
    const title = config.json().title;
    if (location.pathname === "/") {
        document.title = title;
        return;
    }
    /* 静态路由的页面 */
    const github_index = github.index();
    for (let i = 0; i < github_index.length; i++) {
        if (github_index[i].route === location.pathname) {
            document.title = github_index[i].title + " - " + title;
            return;
        }
    }
    /* 动态路由页面 */
    const v = name.name(github.raw_http_url());
    if (v === "") {
        document.title = "未找到文件 - " + title;
        return;
    }
    document.title = decodeURI(v) + " - " + title;
}
export { init, };
