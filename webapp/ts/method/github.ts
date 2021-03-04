import * as config from "../json/config.js"
import * as request from "../library/request.js"
import * as cache from "../library/cache.js"
import * as name from "../library/name.js"


/*
 * 必须是github的公共仓库
 */
const auth = {
    user: config.json().auth.user, /* 用户名 */
    repo: config.json().auth.repo, /* 仓库名 */
    branch: config.json().auth.branch, /* 分支名 */
    root: config.json().auth.root, /* root目录名 */
};

/*
 * 所有root目录下的markdown文件列表
 */
function list(): string[] {
    const text = cache.short("github.list", function (): string {
        /* 获取tree的sha */
        const sha_root: string = function (): string {
            const url = "https://api.github.com/repos/" + auth.user + "/" + auth.repo + "/contents?ref=" + auth.branch;
            const resp = request.GET(url);
            if (resp.code !== 200) return "";
            const data = JSON.parse(resp.text);
            for (let i = 0; i < data.length; i++) {
                if (data[i].path === auth.root) {
                    return data[i].sha;
                }
            }
            return "";
        }();
        if (sha_root === "") return "";
        /* 使用sha获取 所有子文件 */
        const file_s: string[] = function (): string[] {
            let v: string[] = [];
            const url = "https://api.github.com/repos/" + auth.user + "/" + auth.repo + "/git/trees/" + sha_root + "?recursive=1";
            const resp = request.GET(url);
            if (resp.code !== 200) return [];
            const data = JSON.parse(resp.text);
            for (let i = 0; i < data.tree.length; i++) {
                if (data.tree[i].type === "blob") {
                    v.push(data.tree[i].path);
                }
            }
            return v;
        }()
        if (file_s.length === 0) return "";
        /* 提取markdown后缀名路径 */
        let markdown_s: string[] = [];
        for (let i = 0; i < file_s.length; i++) {
            if (/\.md$/.test(file_s[i])) {
                markdown_s.push(file_s[i]);
            }
        }
        /* 持久化储存字符串 */
        return JSON.stringify(markdown_s);
    });
    return JSON.parse(text);
}

/*
 * 根据浏览器当前页面，获取markdown原始文件
 *   1. 使用配置文件中用户的github公共仓库
 *   2. 路由(location.pathname) 为空是"README.md", 路由为"/v/"开头是动态路由，其他路由则为静态路由（例如/nginx /phpfpm /mysql）
 *   3. 如果本地有缓存，则使用缓存
 */

function raw_linux_path(): string {
    /* 首页 */
    if (location.pathname === "/") return "README.md";
    /* 动态路由 */
    const v1 = location.pathname.split("/v/");
    if (v1.length === 2) return v1[1];
    /* 固定路由 */
    const v2 = index();
    for (let i = 0; i < v2.length; i++) {
        if (v2[i].route === location.pathname) {
            return v2[i].path;
        }
    }
    return "";
}

function raw_http_url(): string {
    const markdown_path = decodeURI(raw_linux_path());
    return cache.short("markdown.url." + markdown_path, function (): string {
        /*
         * README.md
         */
        if (markdown_path === "README.md") {
            const url = "https://api.github.com/repos/" + auth.user + "/" + auth.repo + "/contents?ref=" + auth.branch;
            const resp = request.GET(url);
            const data = JSON.parse(resp.text);
            for (let i = 0; i < data.length; i++) {
                if (data[i].path === "README.md") {
                    return data[i].download_url;
                }
            }
            return ""
        }
        /*
         * 递归裁剪到纯ascii父目录
         *   例如 /shell/bash/开发/测试/123, 需要得到/shell/bash
         *   因为github的api不能完整支持非ascii字符串，必须用ascii父目录获取到子目录
         */
        let father_dir = name.dir(markdown_path);
        const url = "https://api.github.com/repos/" + auth.user + "/" + auth.repo + "/contents/" + auth.root + "/" + father_dir + "?ref=" + auth.branch + "&recursive=1";
        const resp = request.GET(url);
        const data = JSON.parse(resp.text);
        for (let i = 0; i < data.length; i++) {
            if (data[i].path === auth.root + "/" + markdown_path) {
                return data[i].download_url;
            }
        }
        return "";
    });
}

function raw(): string {
    const raw_404 = "#### 未找到文件";

    /*
     * 根据markdown路径，获取markdown文件的下载地址
     */
    return cache.short("markdown.raw." + decodeURI(raw_linux_path()), function (): string {
        const download_url = raw_http_url();
        if (download_url === "") return raw_404;
        const resp = request.GET(download_url)
        return resp.text;
    });
}

interface indexT {
    route: string
    title: string
    path: string
    hide: boolean
}

function index(): indexT[] {
    // 例如 https://raw.githubusercontent.com/<username>/opdocs/master/docs/index.json
    const text = cache.short("static", function (): string {
        const url = "https://raw.githubusercontent.com/" +
            auth.user + "/" + auth.repo + "/" + auth.branch + "/" + auth.root + "/index.json";
        const resp = request.GET(url);
        return resp.text;
    })
    const data = JSON.parse(text);
    let returnData: indexT[] = [];
    for (const k in data) {
        if (!data.hasOwnProperty(k)) continue;
        returnData.push({
            route: k,
            title: data[k].title,
            path: data[k].path,
            hide: data[k].hide === true,
        })
    }
    return returnData;
}

export {
    list,
    raw,
    raw_http_url,
    index,
}
