export default function getFormattedDate(ISODate) {
    let UTC_Date = new Date(ISODate);
    let day = UTC_Date.getDate();
    let month = UTC_Date.getMonth() + 1;
    let year = UTC_Date.getFullYear();
    return day + '/' + month + '/' + year;
}
