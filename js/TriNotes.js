function triLoad(){
  var usrSeed = docCookies.getItem("usrSeed");
  if (usrSeed == null) {
    document.getElementById("noSeed").setAttribute("style","display: inline;");
  } else {
    document.getElementById("withSeed").setAttribute("style","display: inline;");
    document.getElementById("SeedName").innerHTML = usrSeed;
  }
}

function setSeed(){
  alert("setSeed")
  document.getElementById("noSeed").setAttribute("style","display: none;");
  document.getElementById("withSeed").setAttribute("style","display: inline;");
  var userSeed = document.getElementById("seed").value;
  document.getElementById("SeedName").innerHTML = userSeed;
  docCookies.setItem("usrSeed",userSeed,Infinity,"/","",true);
  // alert("Cookie已保存种子，重置请清除浏览器缓存或点击页面重置按钮。");
}

function resetSeed(){
  alert("resetSeed")
  document.getElementById("noSeed").setAttribute("style","display: inline;");
  document.getElementById("withSeed").setAttribute("style","display: none;");
  docCookies.removeItem("usrSeed","/","");
}


function generate(){
  var usrSeed = document.getElementById("SeedName").innerHTML;
  const date = new Date();
  var Y = date.getFullYear().toString().slice(-2);
  var M = (date.getMonth() + 1).toString();   if(M.length==1)M="0"+M;
  var D = date.getDate().toString();   if(D.length==1)D="0"+D;
  var appendTimeTag = usrSeed+Y+M+D;
  var rng = new xRNG(appendTimeTag);
  rng.init();
  let note24 = ["c","c#","d","d#","e","f","f#","g","g#","a","a#","b",
                "C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  document.getElementById("TN-a").innerHTML = note24[Math.floor(rng.random()*24)];
  document.getElementById("TN-b").innerHTML = note24[Math.floor(rng.random()*24)];
  document.getElementById("TN-c").innerHTML = note24[Math.floor(rng.random()*24)];
}


// 仅供测试
var testrng = new xRNG("appendTimeTag");
function test(){
  let note24 = ["c","c#","d","d#","e","f","f#","g","g#","a","a#","b",
                "C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  if (document.getElementById("test").innerHTML == "-")
    testrng.init();
  document.getElementById("test").innerHTML = note24[Math.floor(testrng.random()*24)];
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

function Au8(str){
  const encoder = new TextEncoder();
  const utf8Array = encoder.encode(str);
  return Array.from(utf8Array);
}

function Sum(Array){
  let i = 0;
  var s = 0;
  while(i<Array.length){
    s += Number(Array[i]);
    i++;
  }
  return s;
}

function xRNG(seed){
  this.arr = Au8(seed);
  this.base = Sum(this.arr)/1000;
  this.p = 97;
  this.q = 91;
  this.x = 0;
}

xRNG.prototype.init = function(){
  let x = this.base;
  let i = 0;
  let bias = 0;
  let p = this.p;
  let q = this.q;
  while(i<this.arr.length){
    bias = this.arr.indexOf(i);
    x = (x*1000+bias)*p/q;
    x = x-Math.floor(x);
    i++;
  }
  this.x = x;
}

xRNG.prototype.random = function(){
  x = this.x;
  x = x*1000*this.p/this.q;
  x = x-Math.floor(x);
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
  