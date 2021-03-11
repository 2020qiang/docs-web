import * as config from "./config.js";
import * as browserUrl from "./browser_url.js";
import * as name from "../ts/library/name.js";
import * as markdown from "./markdown.js";
function update() {
    config.json(conf => {
        browserUrl.info(info => {
            switch (info.type) {
                case browserUrl.type.index: {
                    document.title = conf.title;
                    return;
                }
                case browserUrl.type.static: {
                    markdown.index(vs => {
                        for (let i = 0; i < vs.length; i++) {
                            if (vs[i].route === location.pathname) {
                                document.title = vs[i].title + " - " + conf.title;
                                return;
                            }
                        }
                    });
                    return;
                }
                case browserUrl.type.float: {
                    document.title = name.name(info.route) + " - " + conf.title;
                    return;
                }
                default: {
                    document.title = "未找到文件 - " + conf.title;
                }
            }
        });
    });
}
export { update, };
