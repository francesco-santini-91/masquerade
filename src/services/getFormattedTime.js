export default function getFormattedDate(ISODate) {
    let UTC_Date = new Date(ISODate);
    let hours = UTC_Date.getHours();
    let minutes = UTC_Date.getMinutes();
    return hours + ':' + minutes;
}
