import * as config from "./config.js";
import * as browserUrl from "./browser_url.js";
import * as name from "../ts/library/name.js";
import * as markdown from "./markdown.js";
function update() {
    const info = browserUrl.info();
    switch (info.type) {
        case browserUrl.type.index: {
            document.title = config.json().title;
            return;
        }
        case browserUrl.type.static: {
            const vs = markdown.index();
            for (let i = 0; i < vs.length; i++) {
                if (vs[i].route === location.pathname) {
                    document.title = vs[i].title + " - " + config.json().title;
                    return;
                }
            }
            return;
        }
        case browserUrl.type.float: {
            document.title = name.name(info.route) + " - " + config.json().title;
            return;
        }
        default: {
            document.title = "未找到文件 - " + config.json().title;
        }
    }
}
export { update, };
