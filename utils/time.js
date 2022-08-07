export function getTimeDiff(start, end) {
    let timeDiff = (new Date(end)).getTime() - (new Date(start)).getTime();
    let seconds = Math.floor(timeDiff / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    seconds = seconds % 60;
    minutes = minutes % 60;

    return `${padTo2Digits(hours)} hours : ${padTo2Digits(minutes)} mins : ${padTo2Digits(seconds)} secs`; 
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
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

    return `${hour}:${min}:${sec} ${session} ${month}/${day}/${year}`;
}