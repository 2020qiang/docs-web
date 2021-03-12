import * as config from "./config.js";
import * as server from "./server.js";
import * as browserUrl from "./browser_url.js"
import * as name from "../ts/library/name.js";

interface filesI {
    (array: string[]): void
}

function files(files_callback: filesI): void {
    config.json(conf => {
        const auth = conf.auth;

        /* 获取tree的sha */
        function sha_root(callback: Function): void {
            const url = "https://api.github.com/repos/" + auth.user + "/" + auth.repo + "/contents?ref=" + auth.branch;
            server.GET(url, resp => {
                const data = JSON.parse(resp);
                for (let i = 0; i < data.length; i++) {
                    if (data[i].path === auth.root) {
                        return callback(data[i].sha);
                    }
                }
            });
        }

        /* 使用sha获取 所有子文件 */
        function file_s(callback: Function): void {
            sha_root((sha: string) => {
                if (sha === "") return callback([]);

                let v: string[] = [];
                const url = "https://api.github.com/repos/" + auth.user + "/" + auth.repo + "/git/trees/" + sha + "?recursive=1";
                server.GET(url, resp => {
                    const data = JSON.parse(resp);
                    for (let i = 0; i < data.tree.length; i++) {
                        if (data.tree[i].type === "blob") {
                            v.push(data.tree[i].path);
                        }
                    }
                    callback(v);
                });
            });
        }

        /* 提取.md结尾的文件*/
        file_s((fs: string[]) => {
            if (fs.length === 0) return files_callback([]);
            /* 提取markdown后缀名路径 */
            let markdown_s: string[] = [];
            for (let i = 0; i < fs.length; i++) {
                if (/\.md$/.test(fs[i])) {
                    markdown_s.push(fs[i]);
                }
            }
            /* 持久化储存字符串 */
            files_callback(markdown_s.sort());
        });
    });
}

interface indexT {
    route: string
    title: string
    path: string
    hide: boolean
}

interface indexI {
    (array: indexT[]): void
}

function index(callback: indexI): void {
    // 例如 https://raw.githubusercontent.com/<username>/opdocs/master/docs/index.json
    config.json(conf => {
        const auth = conf.auth;
        const url = "https://raw.githubusercontent.com/" + auth.user + "/" + auth.repo + "/" + auth.branch + "/" + auth.root + "/index.json";
        server.GET(url, resp => {
            const data = JSON.parse(resp);
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
            callback(returnData);
        });
    });
}

/*
 * 从url获取当前应该展示哪个markdown文件，并返回下载url
 */

interface urlI {
    (url: string): void
}

function url_get_which_file_download_url(callback: urlI): void {
    config.json(conf => {
        browserUrl.info(info => {
            const auth = conf.auth;
            switch (info.type) {
                /*
                 * 首页
                 */
                case browserUrl.type.index: {
                    const url = "https://api.github.com/repos/" + auth.user + "/" + auth.repo + "/contents?ref=" + auth.branch;
                    server.GET(url, resp => {
                        const data = JSON.parse(resp);
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].path === "README.md") return callback(data[i].download_url);
                        }
                    });
                    return;
                }
                /*
                 * 静态页 和 动态页
                 */
                case browserUrl.type.static:
                case browserUrl.type.float: {
                    const father_dir = name.dir(info.route);
                    const url = "https://api.github.com/repos/" + auth.user + "/" + auth.repo + "/contents/" + auth.root + "/" + father_dir + "?ref=" + auth.branch + "&recursive=1";
                    server.GET(url, resp => {
                        const data = JSON.parse(resp);
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].path === auth.root + "/" + info.route) {
                                return callback(data[i].download_url);
                            }
                        }
                        return callback("");
                    });
                    break;
                }
                default : {
                    return callback("");
                }
            }
        });
    });
}

export {
    files,
    index,
    url_get_which_file_download_url,
}
