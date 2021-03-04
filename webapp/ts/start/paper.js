var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as add from "../library/add.js";
import * as config from "../json/config.js";
import * as github from "../method/github.js";
import * as name from "../library/name.js";
const Global = {
    id: "paper",
};
function init(callback) {
    add.js("/vendor/marked.js.org/marked.min-20200628.js", function () {
        return __awaiter(this, void 0, void 0, function* () {
            /* markdown空白换行可配置保留 */
            let markdown_text = github.raw();
            while (config.json().page.format.line_break && /\n\n\n\n/.test(markdown_text)) {
                markdown_text = markdown_text.replace(/\n\n\n\n/g, "\n\n<br>\n\n");
            }
            let ele = document.getElementById(Global.id);
            if (ele === null)
                return;
            ele.setAttribute("style", "");
            // @ts-ignore
            ele.innerHTML += marked(markdown_text);
            let loading = document.getElementById("loading-paper");
            if (loading === null)
                return;
            loading.style.display = "none";
            callback();
        });
    });
}
const opt = {
    img: function () {
        function src_new(v) {
            /* 外链保持原样 */
            if (/^https:\/\//.test(v)) {
                return v;
            }
            /* 绝对路径保持原样 */
            if (/^\//.test(v)) {
                return v;
            }
            /* 修正相对路径 */
            const dir = name.dir(github.raw_http_url());
            return dir + "/" + v;
        }
        /* 写入 */
        let ele_fa = document.getElementById(Global.id);
        if (ele_fa === null)
            return;
        let ele_img = ele_fa.getElementsByTagName("img");
        for (let i = 0; i < ele_img.length; i++) {
            const old = ele_img[i].attributes[0].value;
            ele_img[i].src = src_new(old);
            ele_img[i].onerror = function () {
                ele_img[i].alt = "图片没找到";
            };
            ele_img[i].ondragstart = function () {
                return false;
            };
        }
    },
    a: function () {
        let ele_fa = document.getElementById(Global.id);
        if (ele_fa === null)
            return;
        let ele_a = ele_fa.getElementsByTagName("a");
        for (let i = 0; i < ele_a.length; i++) {
            ele_a[i].target = "_Blank";
            ele_a[i].onmousedown = function () {
                if (confirm("即将前往 " + ele_a[i].href)) {
                    window.open(ele_a[i].href, "_blank");
                }
            };
        }
    },
};
export { init, opt, Global, };
