function show() {
    let ele = document.getElementById("loading");
    if (ele !== null)
        ele.style.display = "";
    console.log(1);
}
function hide() {
    let ele = document.getElementById("loading");
    if (ele !== null)
        ele.style.display = "none";
    console.log(2);
}
export { show, hide, };
