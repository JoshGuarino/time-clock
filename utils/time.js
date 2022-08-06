export function getTimeFromStart(dateTime) {
    const now = (new Date()).getTime();
    document.getElementById('clock').innerHTML = now-dateTime.getTime();
}

export function startClock(dateTime) {
    getTimeFromStart(dateTime);
    setInterval(getTimeFromStart, 1000, dateTime);
}

export function getDateTime(datime){
    let date = new Date(datime);
    let hour =  date.getHours();
    let min =  date.getMinutes();
    let sec = date.getSeconds();
    let session = "AM";
    let month = date.getMonth();
    let day = date.getDate();
    let year = date.getFullYear();

    if(hour == 0){
        hour = 12;
    }
    
    if(hour > 12){
        hour = hour - 12;
        session = "PM";
    }
    
    hour = (hour < 10) ? "0" + hour : hour;
    min = (min < 10) ? "0" + min : min;
    sec = (sec < 10) ? "0" + sec : sec;

    return `${hour}:${min}:${sec} ${session}, ${month}/${day}/${year}`;
}