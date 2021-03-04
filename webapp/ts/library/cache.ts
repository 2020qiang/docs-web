/* check */
const is = {
    old: function (long: boolean, key: string): boolean {
        let v = localStorage.getItem(key + ".timestamp");
        if (v === null) return true;
        const now = Math.floor(Date.now() / 1000);
        if (long) {
            return Number(v) + (60 * 60 * 24 * 7) < now; /* 时间戳小于7天,表示数据太老了 */
        }
        return Number(v) + (60 * 60 * 24 * 2) < now; /* 时间戳小于2天,表示数据太老了 */
    },
    exist: function (key: string): boolean {
        let v1 = localStorage.getItem(key);
        let v2 = localStorage.getItem(key + ".timestamp");
        return v1 !== null && v2 !== null;
    },
}


function write(key: string, value: string): void {
    localStorage.setItem(key, value);
    localStorage.setItem(key + ".timestamp", Math.floor(Date.now() / 1000).toString());
}


function local(long: boolean, key: string, fetch: Function): string {
    if (!is.exist(key)) {
        const v: string = fetch();
        write(key, v);
        return v;
    }
    if (is.old(long, key)) {
        const v: string = fetch();
        write(key, v);
        return v;
    }
    const v = localStorage.getItem(key);
    if (v === null) return "";
    return v;
}

function long(key: string, fetch: Function): string {
    key = "long." + key;
    if (!is.exist(key)) {
        const v: string = fetch();
        write(key, v);
        return v;
    }
    if (is.old(true, key)) {
        const v: string = fetch();
        write(key, v);
        return v;
    }
    const v = localStorage.getItem(key);
    if (v === null) return "";
    return v;
}

function short(key: string, fetch: Function): string {
    key = "short." + key;
    if (!is.exist(key)) {
        const v: string = fetch();
        write(key, v);
        return v;
    }
    if (is.old(false, key)) {
        const v: string = fetch();
        write(key, v);
        return v;
    }
    const v = localStorage.getItem(key);
    if (v === null) return "";
    return v;
}

export {
    long,
    short,
}
