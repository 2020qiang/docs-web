import * as name from "../ts/library/name.js"

window.onload = main;

function main() {
    window.parent.postMessage("read", location.href);
    window.addEventListener('message', function (e) {
        // @ts-ignore
        document.body.innerHTML = marked(e.data.markdown_source);
        change_img_src(e.data.http_url).then();
        click_a_alert().then();

        window.parent.postMessage("end", location.href);
    });
}


/*
 * 优化拼接img源地址
 */
async function change_img_src(http_url: string) {
    const format_src = function (v: string): string {
        /* 外链保持原样 */
        if (/^https:\/\//.test(v)) return v;
        /* 修正相对路径 */
        return name.dir(http_url) + "/" + v;
        /* 绝对路径暂时不管 */
    }
    /* 写入 */
    let ele_img = document.body.getElementsByTagName("img");
    for (let i = 0; i < ele_img.length; i++) {
        ele_img[i].src = format_src(ele_img[i].attributes[0].value);
        ele_img[i].onerror = function () {
            ele_img[i].alt = "图片没找到";
            ele_img[i].style.color = "red";
        };
        ele_img[i].ondragstart = function (): boolean {
            return false;
        };
    }
}

/*
 * 优化点击url跳转前提示
 */
async function click_a_alert() {
    let a = document.body.getElementsByTagName("a");
    for (let i = 0; i < a.length; i++) {
        a[i].dataset.href = a[i].href;
        a[i].href = "#";
        a[i].onmousedown = function () {
            if (confirm("即将前往 " + a[i].dataset.href)) {
                window.open(a[i].dataset.href, "_blank");
            }
        };
    }
}
