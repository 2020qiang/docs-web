import * as markdown from "./markdown.js";

const float_split: string = "/?/";

enum type {
    index,
    static,
    float,
    unknown
}

interface browserUrlT {
    type: type,
    route: string,
}

interface infoI {
    (info: browserUrlT): void
}

/*
 * 根据浏览器当前页面，获取markdown原始文件
 *   1. 使用配置文件中用户的github公共仓库
 *   2. 路由(location.pathname) 为空是"README.md", 路由为"/v/"开头是动态路由，其他路由则为静态路由（例如/nginx /phpfpm /mysql）
 *   3. 如果本地有缓存，则使用缓存
 */
function info(callback: infoI): void {
    const url_arg_from_browser = location.pathname + location.search;
    /*
     * 首页
     */
    if (url_arg_from_browser === "/") return callback({
        type: type.index,
        route: "README.md",
    });

    /*
     * 固定路由
     */
    markdown.index(array => {
        for (let i = 0; i < array.length; i++) {
            if (array[i].route === url_arg_from_browser) {
                return callback({
                    type: type.static,
                    route: decodeURI(array[i].path),
                });
            }
        }

        /*
         * 动态路由
         */
        const v2 = url_arg_from_browser.split(float_split);
        if (v2.length === 2) return callback({
            type: type.float,
            route: decodeURI(v2[1]),
        });

        /*
         * 错误
         */
        return callback({
            type: type.unknown,
            route: "",
        })
    });
}

export {
    type,
    browserUrlT,
    info,
    float_split,
}
