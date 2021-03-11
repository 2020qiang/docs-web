import * as server from "./server.js";
function json(callback) {
    server.GET("/webapp/config.json", (resp) => {
        try {
            callback(JSON.parse(resp));
        }
        catch (_a) {
            callback({
                title: "",
                auth: { user: "", repo: "", branch: "", root: "" },
            });
        }
    });
}
export { json, };
