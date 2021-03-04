import * as request from "../library/request.js"
import * as cache from "../library/cache.js"

const Globe = {
    key: "config.json",
    url: "/webapp/config.json",
    default: {
        title: "null",
        auth: {
            user: "null",
            repo: "null",
            branch: "null",
            root: "null",
        },
        expired: 1,
        page: {
            format: {
                line_break: true,
            },
            static: "/webapp/static.json",
        },
    },
};

interface configT {
    title: string,
    auth: {
        user: string,
        repo: string,
        branch: string,
        root: string,
    },
    page: {
        header?: {
            email: string,
            github: string,
        },
        format: {
            line_break: boolean,
        }
        static: string,
    },
}

function remote(): configT {
    const resp = request.GET(Globe.url)
    switch (resp.code) {
        case 200:
            try {
                return JSON.parse(resp.text);
            } catch {
                alert("解析json错误: " + Globe.url);
            }
            return Globe.default;
        case 404:
            alert("未找到配置文件: " + Globe.url);
            return Globe.default;
        default:
            alert("未知错误: " + Globe.url);
            return Globe.default;
    }
}

function json(): configT {
    const text = cache.long(Globe.key, function (): string {
        return JSON.stringify(remote());
    });
    return JSON.parse(text);
}

export {
    json,
    configT,
}
