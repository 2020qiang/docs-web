import * as github from "../method/github.js"
import * as paper from "../start/paper.js"
import * as name from "../library/name.js"

const Global = {
    id: "nav-value",
};


/* 文件界面 */
function active_file(ele: HTMLElement): void {

    interface linkT {
        title: string,
        href: string,
    }

    const add = {
        link: function (link: linkT) {
            let box = document.createElement("div");
            box.className = "piece"
            let l = document.createElement("a");
            l.innerText = link.title;
            l.onmousedown = function () {
                location.href = link.href;
            };
            box.appendChild(l)
            ele.appendChild(box);
        },
        line: function () {
            let box = document.createElement("div");
            box.style.height = "1px";
            box.style.padding = "6px 20px 6px 20px";
            let highlight = document.createElement("div");
            highlight.style.backgroundColor = "#CCCCCC";
            highlight.style.height = "100%";
            box.appendChild(highlight);
            ele.appendChild(box);
        },
    };


    /*
     * 静态的文档链接
     */
    const github_index = github.index();
    let add_line: boolean = false;
    for (let i = 0; i < github_index.length; i++) {
        if (github_index[i].hide) continue;
        add.link({title: github_index[i].title, href: github_index[i].route})
        add_line = true;
    }
    if (add_line) add.line();

    /*
     * 动态的文档链接
     */
    let github_list = github.list();
    for (let i = 0; i < github_index.length; i++) {
        for (let j = 0; j < github_list.length; j++) {
            if (github_list[j] === github_index[i].path) {
                github_list.splice(j, 1);
            }
        }
    }
    for (let i = 0; i < github_list.length; i++) {
        add.link({title: name.name(github_list[i]), href: "/v/" + github_list[i]});
    }
}

/* 大纲界面 */
function active_outline(): void {

    let ele = document.getElementById(Global.id);
    if (ele === null) return;

    /*
     * 所有h标签的内容
     */
    interface levelT {
        tag: number,
        text: string,
        id: string,
    }

    const contents = function (): levelT[] {

        let text_map = new Map();
        let text_sha = [];

        let ele_paper = document.getElementById(paper.Global.id);
        if (ele_paper === null) return [];

        for (let level = 0; level < 9; level++) {
            const ele_levels = ele_paper.getElementsByTagName("h" + (level + 1));
            if (ele_levels === null) continue;

            for (let i = 0; i < ele_levels.length; i++) {
                if (ele_levels[i] === null) continue;

                const sha = ele_levels[i].getBoundingClientRect().top + window.scrollY;
                const tag = level;
                const text = ele_levels[i].innerHTML;
                const id = ele_levels[i].id;


                text_map.set(sha, {
                    tag: tag,
                    text: text,
                    id: id,
                });
                text_sha.push(sha);
            }
        }
        text_sha.sort(function (a, b) {
            return a - b;
        });

        return function (): levelT[] {
            let returnData = [];
            for (let i = 0; i < text_sha.length; i++) {
                returnData.push(text_map.get(text_sha[i]))
            }
            return returnData;
        }();
    }();

    for (let i = 0; i < contents.length; i++) {

        let space = "";
        for (let j = 0; j < contents[i].tag; j++) {
            space += "&emsp;";
        }

        let ele_piece = document.createElement("div");
        ele_piece.className = "piece";
        ele_piece.innerHTML = space + contents[i].text;
        ele_piece.onmousedown = function () {
            location.href = "#" + contents[i].id;
            history.pushState('', '', location.href.split("#", 1)[0]);
        };
        ele.appendChild(ele_piece);
    }
}

/* 隐藏或显示导航栏 */
function active_nav(): void {

    const ele = {
        nav: function (): HTMLElement {
            let v = document.getElementById("nav");
            if (v === null) return document.createElement("");
            return v;
        }(),
        line: function (): HTMLElement {
            let v = document.getElementById("line");
            if (v === null) return document.createElement("");
            return v;
        }(),
        board: function (): HTMLElement {
            let v = document.getElementById("whiteboard");
            if (v === null) return document.createElement("");
            return v;
        }(),
    };

    const check = {
        screen_upright: function (): boolean {
            return window.screen.height > window.screen.width;
        },
    }

    const exec = {
        hide: function (): void {
            ele.nav.setAttribute("data-show", "false");
            ele.line.style.left = "0";
            ele.board.style.left = "2px";
            ele.board.style.width = "calc(100% - 2px)";
        },
        show: function (): void {
            ele.nav.setAttribute("data-show", "true");
            ele.line.style.left = "300px";
            ele.board.style.left = "calc(300px + 2px)";
            ele.board.style.width = "calc(100% - (300px + 2px))";
        },
    }

    function callback(): void {
        /* 横屏状态 */
        if (!check.screen_upright()) {
            if (ele.nav.getAttribute("data-show") === "false") {
                return exec.show();
            }
            return exec.hide();
        }

        /* 竖屏状态 */
        if (ele.nav.getAttribute("data-show") === "true") {
            return exec.hide();
        }
        return exec.show();
    }

    let listen = document.getElementById("header-display-button");
    if (listen === null) return;
    listen.addEventListener("mousedown", function (): void {
        callback();
    });
}

export function init(): void {

    active_nav();

    enum which_mode {
        file,
        outline,
    }

    function button_highlight(which: which_mode): void {
        const white = "#CCCCCC";
        const black = "#434343";

        let vf = document.getElementById("nav-select-file");
        let vo = document.getElementById("nav-select-outline");
        if (vf === null) return;
        if (vo === null) return;

        switch (which) {
            case which_mode.file:
                vf.style.color = black;
                vo.style.color = white;
                break;
            case which_mode.outline:
                vf.style.color = white;
                vo.style.color = black;
                break;
            default:
                break;
        }
        return;
    }

    function active_which(which: which_mode): void {
        let ele = document.getElementById(Global.id);
        if (ele === null) return;
        ele.innerHTML = "";
        ele.style.display = "none";
        if (which === which_mode.file) active_file(ele);
        if (which === which_mode.outline) active_outline();
        ele.style.display = "";

        const loading = {
            id: "loading-nav",
            hide: function (): void {
                let ele = document.getElementById(loading.id);
                if (ele === null) return;
                ele.style.display = "none";
            },
        }
        loading.hide();
        button_highlight(which);
    }

    const ele_file = document.getElementById("nav-select-file");
    const ele_outline = document.getElementById("nav-select-outline");
    if (ele_file === null) return;
    if (ele_outline === null) return;

    /* 监听点击 */
    ele_file.addEventListener("mousedown", function () {
        active_which(which_mode.file);
    });
    ele_outline.addEventListener("mousedown", function () {
        active_which(which_mode.outline);
    });

    /*
     * 有选择性查看文档的话，一并显示大纲界面
     */
    if (location.pathname === "/") return active_which(which_mode.file);
    active_which(which_mode.outline);
}
