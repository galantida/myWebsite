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

        // callers callback function. 
        this.callbackFunction();
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
}