function Templates() {
    this.templates = [];
    this.callbackFunction;
    this.batchMode = false;

    this.rm = new XHRRequestManager();

    Templates.prototype.loadTemplate = function (templateURL, callbackFunction) {
        console.log("Templates: Load Template '" + templateURL + "'.");
        this.batchMode = false;
        this.callbackFunction = callbackFunction; // set callers callback
        this.rm.request(templateURL, this.internalCallback.bind(this), templateURL); // send request with callback to thsi instances internal callback
    }

    Templates.prototype.loadTemplates = function (templateList, callbackFunction) {
        console.log("Templates: Requesting template batch.");
        this.batchMode = true;
        this.callbackFunction = callbackFunction; // set callers batch callback

        this.rm.setBatchCallback(this.completed.bind(this));
        for (var t = 0; t < templateList.length; t++) {
            this.rm.request(templateList[t], this.internalCallback.bind(this), templateList[t], true);
        }
    }

    Templates.prototype.internalCallback = function (responseText, templateURL) {
        // template name
        var start = templateURL.lastIndexOf("/") + 1;
        var end = templateURL.lastIndexOf(".");
        var templateName = templateURL.substring(start, end);
        console.log("Templates: Adding template '" + templateName + "'.");

        var template = new Template(templateName, templateURL, responseText);
        this.templates[this.templates.length] = template;

        // callers callback function. Not called when batching
        if (!this.batchMode) this.completed();
    }

    Templates.prototype.completed = function () {
        console.log("Templates: Downloads complete.");
        console.log(this.templates)
        this.callbackFunction();
    }

    Templates.prototype.getTemplate = function (templateName) {
        for (var t = 0; t < this.templates.length; t++) {
            if (this.templates[t].name == templateName) return this.templates[t];
        }
        return null;
    }
}


