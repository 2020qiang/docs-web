/*
 * 文件路径分隔
 */
/* 获取子目录名 */
function dir(path) {
    const obj = path.lastIndexOf("/");
    if (obj === null)
        return "";
    return path.substr(0, obj);
}
/* 获取文件名字 */
function name(path) {
    const obj = path.lastIndexOf("/");
    if (obj === null)
        return "";
    return path.substr(obj + 1).replace(/\.[a-zA-Z0-9]+$/g, "");
}
/* 获取文件后缀名 */
function type(path) {
    const obj = path.lastIndexOf("/");
    if (obj === null)
        return "";
    return path.substring(path.lastIndexOf('.') + 1);
}
export { dir, name, type, };
