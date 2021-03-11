import * as server from "./server.js"

interface configT {
    title: string,
    auth: {
        user: string,
        repo: string,
        branch: string,
        root: string,
    },
}

interface configI {
    (conf: configT): void
}

function json(callback: configI): void {
    server.GET("/webapp/config.json", (resp: string) => {
        try {
            callback(JSON.parse(resp));
        } catch {
            callback({
                title: "",
                auth: {user: "", repo: "", branch: "", root: ""},
            });
        }
    });
}

export {
    json,
    configT,
}
