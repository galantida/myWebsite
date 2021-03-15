function formatDate(dateTime) {
    var dateTimeString = dateTime.toString();
    return dateTimeString.substring(0, dateTimeString.indexOf(':') - 2);
}