function startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    let session = "AM"

    if (h >= 12) {
        session = "PM";
    }
    if (h == 0) {
        h = 12;
    }
    else if (h > 12) {
        h = h - 12;
    }

    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('time').innerHTML = h + ":" + m + ":" + s +" "+ session;
    setTimeout(startTime, 1000);
}

function checkTime(i) {
    if (i < 10) { i = "0" + i };
    return i;
}

function startDate() {
    const today = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let dy = days[today.getDay()];
    let d = today.getDate();
    let m = today.getMonth() + 1;
    let y = today.getFullYear();

    document.getElementById('date').innerHTML = dy + ": " + d + "/" + m + "/" + y;
}

function onLoadFunctions() {
    startTime();
    startDate();
}
