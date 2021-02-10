export default function getFormattedEventTime(event) {
    let UnixEpochTime = event.substr(0, 10);
    let UTC_Date = new Date(UnixEpochTime * 1000);
    let hours = UTC_Date.getHours();
    let minutes = UTC_Date.getMinutes();
    return hours + ':' + minutes + event.substr(13, event.length);
}
