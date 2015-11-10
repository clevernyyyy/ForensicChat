function getCurrentTimeFormatted(format, hr12) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var d = new Date();
    var day = days[d.getDay()];
    var hr = d.getHours();
    var min = d.getMinutes();
    if (min < 10) {
        min = "0" + min;
    }
    var ampm = hr < 12 ? "am" : "pm";
    var date = d.getDate();
    var month = months[d.getMonth()];
    var year = d.getFullYear();
    if (hr12) {
        if (hr != 0) {
            hr = hr > 12 ? hr - 12 : hr;
        } else {
            hr = 12;
        }
    }

    switch (format) {
        case 1:
            ret = hr + ":" + min + ampm + "<strong> · </strong>" + date + " " + month + " " + year;
            break;
        case 2:
            ret = hr + ":" + min + ampm;
            break;
        default:
            ret = day + " " + hr + ":" + min + ampm + " " + date + " " + month + " " + year;
    }
    return ret;
}