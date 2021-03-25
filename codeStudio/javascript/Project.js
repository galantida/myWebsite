function Project() {
    this.content;
    this.callbackFunction;
    this.contentLibraryURL;

    this.rm = new XHRRequestManager();

    // load a single project from info.json
    Project.prototype.load = function (projectFileURL, callbackFunction) {
        console.log("Project: Loading project '" + projectFileURL + "'.");
        this.callbackFunction = callbackFunction; // set callers callback
        this.rm.request(projectFileURL, this.internalCallback.bind(this), projectFileURL); // send request with callback to thsi instances internal callback
    }

    Project.prototype.internalCallback = function (responseText, projectFileURL) {
        // content name
        var parts = projectFileURL.split('/');
        var name = parts[parts.length - 2];

        this.content = JSON.parse(responseText);
        this.content.name = name;
        this.content.folder = name;

        this.content.coverImage = this.getCoverImage();

        // callers callback function. 
        this.callbackFunction();
    }

    Project.prototype.getCoverImage = function () {

        // use the specified project image if exists
        if (this.content.image != null) return this.content.image; 

        // find first image in content
        for (var e = 0; e < this.content.entries.length; e++) {
            if (this.content.entries[e].image != null) return this.content.entries[e].image;
            if (this.content.entries[e].thumbnail != null) return this.content.entries[e].thumbnail;
        }

        // return no image?
    }

    Project.prototype.started = function () {
        // get date range
        var started = new Date("1/1/2800");
        for (var e = 0; e < this.content.entries.length; e++) {
            if (this.content.entries[e].date) {
                var curDate = new Date(this.content.entries[e].date);
                if (curDate < started) started = curDate;
            }
        }

        if (started != new Date("1/1/2800")) return started;
        else return null;
    }

    Project.prototype.updated = function () {
        // get date range
        var updated = new Date("1/1/1800");
        if (this.content.entries) {
            for (var e = 0; e < this.content.entries.length; e++) {
                if (this.content.entries[e].date) {
                    var curDate = new Date(this.content.entries[e].date);
                    if (curDate > updated) updated = curDate;
                }
            }
        }

        if (updated != new Date("1/1/1800")) return updated;
        else return null;
    }

    Project.prototype.search = function (searchString) {

        searchString = searchString.toLowerCase();

        // this could be more interesting. (- and or etc...)
        var searchTerms = searchString.split(',');
        for (var s = 0; s < searchTerms.length; s++) {
            searchTerms[s] = searchTerms[s].trim();
        }

        // search content
        var count = 0;
        for (var e = 0; e < this.content.entries.length; e++) {
            count += search(searchTerms, this.content.entries[e].title);
            count += search(searchTerms, this.content.entries[e].text);
            count += search(searchTerms, this.content.entries[e].name);
        }

        // search tags
        if (this.content.tags != null) {
            var tagString = "";
            for (var t = 0; t < this.content.tags.length; t++) {
                for (var s = 0; s < searchTerms.length; s++) {
                    if (this.content.tags[t].toLowerCase() == searchTerms[s]) count++;
                }
            }
        }

        return count;
    }
}