function triLoad() {
  var usrSeed = docCookies.getItem("usrSeed");
  if (usrSeed == null) {
    document.getElementById("noSeed").setAttribute("style", "display: inline;");
  } else {
    document.getElementById("withSeed").setAttribute("style", "display: inline;");
    document.getElementById("SeedName").innerHTML = usrSeed;
  }
  var historyNotes = docCookies.getItem("historyNotes");
  if (historyNotes == null) {
    document.getElementById("historyNotes").innerHTML = "暂无记录";
  } else {
    document.getElementById("historyNotes").innerHTML = historyNotes;
  }
}

function setSeed() {
  alert("setSeed")
  document.getElementById("noSeed").setAttribute("style", "display: none;");
  document.getElementById("withSeed").setAttribute("style", "display: inline;");
  var userSeed = document.getElementById("seed").value;
  document.getElementById("SeedName").innerHTML = userSeed;
  docCookies.setItem("usrSeed", userSeed, Infinity, "/", "", true);
  // alert("Cookie已保存种子，重置请清除浏览器缓存或点击页面重置按钮。");
}

function resetSeed() {
  alert("resetSeed")
  document.getElementById("noSeed").setAttribute("style", "display: inline;");
  document.getElementById("withSeed").setAttribute("style", "display: none;");
  docCookies.removeItem("usrSeed", "/", "");
}


function generate() {
  var usrSeed = document.getElementById("SeedName").innerHTML;
  const date = new Date();
  var Y = date.getFullYear().toString().slice(-2);
  var M = (date.getMonth() + 1).toString(); if (M.length == 1) M = "0" + M;
  var D = date.getDate().toString(); if (D.length == 1) D = "0" + D;
  var appendTimeTag = usrSeed + Y + M + D;
  var rng = new xRNG(appendTimeTag);
  rng.init();
  let note24 = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b",
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  document.getElementById("TN-a").innerHTML = note24[Math.floor(rng.random() * 24)];
  document.getElementById("TN-b").innerHTML = note24[Math.floor(rng.random() * 24)];
  document.getElementById("TN-c").innerHTML = note24[Math.floor(rng.random() * 24)];

  document.getElementById("seedWithDay").innerHTML = appendTimeTag;
  // var t = document.getElementById("queryText").value;
  // document.getElementById("test").innerHTML = (appendTimeTag==t);
  // document.getElementById("test").innerHTML = t;
}

function query() {
  var appendTimeTag = document.getElementById("queryText").value;
  var rng = new xRNG(appendTimeTag);
  rng.init();
  let note24 = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b",
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  document.getElementById("q-a").innerHTML = note24[Math.floor(rng.random() * 24)];
  document.getElementById("q-b").innerHTML = note24[Math.floor(rng.random() * 24)];
  document.getElementById("q-c").innerHTML = note24[Math.floor(rng.random() * 24)];
}

function recordToday(){
  var seedWithDay = document.getElementById("seedWithDay").innerHTML;
  var a = document.getElementById("TN-a").innerHTML;
  var b = document.getElementById("TN-b").innerHTML;
  var c = document.getElementById("TN-c").innerHTML;
  var Today = seedWithDay+" : "+a+" "+b+" "+c;
  if(confirm("是否记下今天这份记忆？")){
    var historyNotes = docCookies.getItem("historyNotes");
    // var tmparry = new Array("xy01","xy02","xy03","xy04","xy05","xy06","xy07","xy08","xy09")
    // historyNotes = tmparry.join("<br>");
    if (historyNotes == null) {
      alert("没有ck");
      document.getElementById("historyNotes").innerHTML = Today;
      docCookies.setItem("historyNotes", Today, Infinity, "/", "", true);
    } else {
      alert("有ck");
      var myHistory = historyNotes.split("<br>");
      if(myHistory.length == 9){
        if(confirm("将要超过容限，确认保存并抛去最后一行？")){
          myHistory.pop();
          var Update = Today.concat("<br>",myHistory.join("<br>"));
          document.getElementById("historyNotes").innerHTML = Update;
        }
      }
      docCookies.setItem("historyNotes", Update, Infinity, "/", "", true);
    }
  }
}

function playSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'sine';
  oscillator.frequency.value = 220;
  oscillator.start(audioContext.currentTime);

  setTimeout(() => {
    oscillator.stop(audioContext.currentTime + 1);
  }, 1000);
}

// 仅供测试
var testrng = new xRNG("appendTimeTag");
function test() {
  let note24 = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b",
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  if (document.getElementById("test").innerHTML == "-")
    testrng.init();
  document.getElementById("test").innerHTML = note24[Math.floor(testrng.random() * 24)];
}

/*\
|*|
|*|  :: xRNG(seed) ::
|*|
|*|  generate random number by seed(str), p=97, q=91.
|*|
|*|  Syntaxes:
|*|  
|*|  * var rng = xRNG(seed);
|*|  * xRNG.init();
|*|  * var rnum = xRNG.random();
\*/

function Au8(str) {
  const encoder = new TextEncoder();
  const utf8Array = encoder.encode(str);
  return Array.from(utf8Array);
}

function Sum(Array) {
  let i = 0;
  var s = 0;
  while (i < Array.length) {
    s += Number(Array[i]);
    i++;
  }
  return s;
}

function xRNG(seed) {
  this.arr = Au8(seed);
  this.base = Sum(this.arr) / 1000;
  this.p = 97;
  this.q = 91;
  this.x = 0;
}

xRNG.prototype.init = function () {
  let x = this.base;
  let i = 0;
  let bias = 0;
  let p = this.p;
  let q = this.q;
  while (i < this.arr.length) {
    bias = this.arr.indexOf(i);
    x = (x * 1000 + bias) * p / q;
    x = x - Math.floor(x);
    i++;
  }
  this.x = x;
}

xRNG.prototype.random = function () {
  x = this.x;
  x = x * 1000 * this.p / this.q;
  x = x - Math.floor(x);
  this.x = x;
  return x;
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
