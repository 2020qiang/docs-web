import * as http_get_sync from "./http_get_sync.js"

interface configT {
    title: string,
    auth: {
        user: string,
        repo: string,
        branch: string,
        root: string,
    },
}


function json(): configT {
    try {
        const text = http_get_sync.GET("/webapp/config.json");
        return JSON.parse(text);
    } catch {
        document.title = "error";
        document.body.innerText = "Error: fetch /webapp/config.json from remote fail";
        return {
            title: "",
            auth: {user: "", repo: "", branch: "", root: ""},
        }
    }
}

export {
    json,
    configT,
}
