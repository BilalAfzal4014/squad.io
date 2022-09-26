function getXDaysAheadDateFromCurrentDate(days) {
    let date = new Date();
    date.setDate(date.getDate() + days);
    return date
}

function convertDateToYMDFormat(date) {
    return date.toISOString().split("T")[0];
}

function timeDiffOfStartAndEndDate(startDate, endDate) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    return (endDate.getTime() - startDate.getTime()) / (1000 * secondsInADay());
}

const secondsInADay = () => 60 * 60 * 24;

module.exports = {
    getXDaysAheadDateFromCurrentDate,
    convertDateToYMDFormat,
    timeDiffOfStartAndEndDate
}
