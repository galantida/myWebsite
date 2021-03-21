function formatDate(dateTime) {
    var dateTimeString = dateTime.toString();
    return dateTimeString.substring(0, dateTimeString.indexOf(':') - 2);
}

// returns a number representing how many of the search terms were found
function search(searchTerms, searchContent) {
    var count = 0;
    if (searchContent != null) {
        searchContent = searchContent.toLowerCase();

        for (var t = 0; t < searchTerms.length; t++) {
            var searchTerm = searchTerms[t].toLowerCase();
            if (searchContent.includes(searchTerm)) count++;
        }
    }

    return count;
}