function check() {
    var usrinfo = docCookies.getItem("usrinfo");
    if (usrinfo == null) {
        setInfo();
    } else {
        getInfo();
    }
}

function setInfo() {
    var name = prompt("名字：");
    var TjuID = prompt("学号：");
    var TjuTp = prompt("人员类型：", "研究生");
    document.getElementById('name').innerText = name;
    document.getElementById('TjuID').innerText = TjuID;
    document.getElementById('TjuTp').innerText = TjuTp;
    docCookies.setItem("name", name, Infinity, "/TJU", "", true);
    docCookies.setItem("TjuID", TjuID, Infinity, "/TJU", "", true);
    docCookies.setItem("TjuTp", TjuTp, Infinity, "/TJU", "", true);
    alert("Cookie已保存信息，重置请清除浏览器缓存。");
    docCookies.setItem("usrinfo", true, Infinity, "/TJU", "", true);
}

function getInfo() {
    var name = docCookies.getItem("name");
    var TjuID = docCookies.getItem("TjuID");
    var TjuTp = docCookies.getItem("TjuTp");
    document.getElementById('name').innerText = name;
    document.getElementById('TjuID').innerText = TjuID;
    document.getElementById('TjuTp').innerText = TjuTp;
}

let where = 1;

function change() {
    if (where < 8) {
        where += 1;
    }
    else {
        where = 1;
    }
    showWhere(where);
}
function showWhere(where) {
    switch (where) {
        case 1:
            document.getElementById('where').innerText = "欢迎通过卫津路西门出口。";
            break;
        case 2:
            document.getElementById('where').innerText = "欢迎通过铭德道出口。";
            break;
        case 3:
            document.getElementById('where').innerText = "欢迎通过卫津路北门出口。";
            break;
        case 4:
            document.getElementById('where').innerText = "欢迎通过卫津路东门出口。";
            break;
        case 5:
            document.getElementById('where').innerText = "欢迎通过卫津路西门入口。";
            break;
        case 6:
            document.getElementById('where').innerText = "欢迎通过铭德道入口。";
            break;
        case 7:
            document.getElementById('where').innerText = "欢迎通过卫津路北门入口。";
            break;
        case 8:
            document.getElementById('where').innerText = "欢迎通过卫津路东门入口。";
            break;
        default:
            break;
    }
}

/*\
|*|
|*|  :: cookies.js ::
|*|
|*|  A complete cookies reader/writer framework with full unicode support.
|*|
|*|  https://developer.mozilla.org/zh-CN/docs/DOM/document.cookie
|*|
|*|  This framework is released under the GNU Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|  Syntaxes:
|*|
|*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * docCookies.getItem(name)
|*|  * docCookies.removeItem(name[, path], domain)
|*|  * docCookies.hasItem(name)
|*|  * docCookies.keys()
|*|
\*/

var docCookies = {
    getItem: function (sKey) {
        return (
            decodeURIComponent(
                document.cookie.replace(
                    new RegExp(
                        "(?:(?:^|.*;)\\s*" +
                        encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") +
                        "\\s*\\=\\s*([^;]*).*$)|^.*$",
                    ),
                    "$1",
                ),
            ) || null
        );
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires =
                        vEnd === Infinity
                            ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT"
                            : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie =
            encodeURIComponent(sKey) +
            "=" +
            encodeURIComponent(sValue) +
            sExpires +
            (sDomain ? "; domain=" + sDomain : "") +
            (sPath ? "; path=" + sPath : "") +
            (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
        if (!sKey || !this.hasItem(sKey)) {
            return false;
        }
        document.cookie =
            encodeURIComponent(sKey) +
            "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
            (sDomain ? "; domain=" + sDomain : "") +
            (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function (sKey) {
        return new RegExp(
            "(?:^|;\\s*)" +
            encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") +
            "\\s*\\=",
        ).test(document.cookie);
    },
    keys: /* optional method: you can safely remove it! */ function () {
        var aKeys = document.cookie
            .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "")
            .split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nIdx = 0; nIdx < aKeys.length; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
    },
};
