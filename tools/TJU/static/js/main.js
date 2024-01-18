function updateMs() {
    const now = new Date();
    const timeString = Math.floor(now.getMilliseconds()/100);
    document.getElementById('Ms').innerText = timeString;
}
function updateSn() {
    const now = new Date();
    const timeString = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('Sn').innerText = timeString;
}
function updateMn() {
    const now = new Date();
    const timeString = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('Mn').innerText = timeString;
}
function updateHr() {
    const now = new Date();
    const timeString = String(now.getHours()).padStart(2, '0');
    document.getElementById('Hr').innerText = timeString;
}
function init(){
    updateMs();
    updateSn();
    updateMn();
    updateHr();
}

// 初始化时间
init();

// 更新
setInterval(updateMs, 100);
// 更新
setInterval(updateSn, 1000);
// 更新
setInterval(updateMn, 60*1000);
// 更新
setInterval(updateHr, 60*60*1000);
