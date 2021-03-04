import * as config from "./config.js";
import * as http_get_sync from "./http_get_sync.js";
import * as browserUrl from "./browser_url.js";
import * as name from "../ts/library/name.js";
const auth = config.json().auth;
function files() {
    /* 获取tree的sha */
    const sha_root = function () {
        const url = "https://api.github.com/repos/" + auth.user + "/" + auth.repo + "/contents?ref=" + auth.branch;
        const resp = http_get_sync.GET(url);
        const data = JSON.parse(resp);
        for (let i = 0; i < data.length; i++) {
            if (data[i].path === auth.root) {
                return data[i].sha;
            }
        }
        return "";
    }();
    if (sha_root === "")
        return [];
    /* 使用sha获取 所有子文件 */
    const file_s = function () {
        let v = [];
        const url = "https://api.github.com/repos/" + auth.user + "/" + auth.repo + "/git/trees/" + sha_root + "?recursive=1";
        const resp = http_get_sync.GET(url);
        const data = JSON.parse(resp);
        for (let i = 0; i < data.tree.length; i++) {
            if (data.tree[i].type === "blob") {
                v.push(data.tree[i].path);
            }
        }
        return v;
    }();
    if (file_s.length === 0)
        return [];
    /* 提取markdown后缀名路径 */
    let markdown_s = [];
    for (let i = 0; i < file_s.length; i++) {
        if (/\.md$/.test(file_s[i])) {
            markdown_s.push(file_s[i]);
        }
    }
    /* 持久化储存字符串 */
    return markdown_s.sort();
}
function index() {
    // 例如 https://raw.githubusercontent.com/<username>/opdocs/master/docs/index.json
    const url = "https://raw.githubusercontent.com/" +
        auth.user + "/" + auth.repo + "/" + auth.branch + "/" + auth.root + "/index.json";
    const text = http_get_sync.GET(url);
    const data = JSON.parse(text);
    let returnData = [];
    for (const k in data) {
        if (!data.hasOwnProperty(k))
            continue;
        returnData.push({
            route: k,
            title: data[k].title,
            path: data[k].path,
            hide: data[k].hide === true,
        });
    }
    return returnData;
}
/*
 * 从url获取当前应该展示哪个markdown文件，并返回下载url
 */
function url_get_which_file_download_url() {
    const info = browserUrl.info();
    switch (info.type) {
        /*
         * 首页
         */
        case browserUrl.type.index: {
            const url = "https://api.github.com/repos/" + auth.user + "/" + auth.repo + "/contents?ref=" + auth.branch;
            const resp = http_get_sync.GET(url);
            const data = JSON.parse(resp);
            for (let i = 0; i < data.length; i++) {
                if (data[i].path === "README.md")
                    return data[i].download_url;
            }
            return "";
        }
        /*
         * 静态页 和 动态页
         */
        case browserUrl.type.static:
        case browserUrl.type.float: {
            const father_dir = name.dir(info.route);
            const url = "https://api.github.com/repos/" + auth.user + "/" + auth.repo + "/contents/" + auth.root + "/" + father_dir + "?ref=" + auth.branch + "&recursive=1";
            const resp = http_get_sync.GET(url);
            const data = JSON.parse(resp);
            for (let i = 0; i < data.length; i++) {
                if (data[i].path === auth.root + "/" + info.route) {
                    return data[i].download_url;
                }
            }
            return "";
        }
    }
    return "";
}
export { files, index, url_get_which_file_download_url, };
