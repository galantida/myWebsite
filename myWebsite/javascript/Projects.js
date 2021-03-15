function Projects() {
    this.projects = [];
    this.callbackFunction;
    this.pendingRequest = 0;

    this.rm = new XHRRequestManager();

    // load all projects listed in the index.json
    Projects.prototype.loadProjectsByIndexFile = function (projectsIndexFileURL, callbackFunction) {
        this.callbackFunction = callbackFunction;
        this.rm.request(projectsIndexFileURL, this.loaded.bind(this), projectsIndexFileURL); // get the index of content
    }

    Projects.prototype.loaded = function (responseText, projectsIndexFileURL) {

        // build project folder path
        var projectsFileURL = projectsIndexFileURL.substring(0, projectsIndexFileURL.lastIndexOf('/'));

        //modify array to include path
        var projectsArray = JSON.parse(responseText);
        for (var t = 0; t < projectsArray.length; t++) {
            // build url list
            projectsArray[t] = projectsFileURL + "/" + projectsArray[t] + "/info.json"; 
        }
        this.loadProjectsByArray(projectsArray, this.callbackFunction);
    }

    // load a list fo projects from info.json
    Projects.prototype.loadProjectsByArray = function (projectsArray, callbackFunction) {
        console.log("Projects: Requesting project batch.");
        console.log(projectsArray);
        this.callbackFunction = callbackFunction; // set callers batch callback
        
        this.pendingRequest = projectsArray.length;
        for (var t = 0; t < projectsArray.length; t++) {
            this.projects[this.projects.length] = new Project();
            this.projects[this.projects.length - 1].load(projectsArray[t], this.internalCallback.bind(this)); // load info file for each content folder on list
        }
        console.log(this.projects);
    }

    Projects.prototype.internalCallback = function (responseText) {
        // callers callback function. Not called when batching
        this.pendingRequest--;
        if (this.pendingRequest == 0) this.callbackFunction();
    }

    Projects.prototype.getProject = function (name) {
        for (var t = 0; t < this.projects.length; t++) {
            if (this.projects[t].content.name == name) return this.projects[t];
        }
        return null;
    }
}