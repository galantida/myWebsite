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
        this.loadProjectsFromProjectNames(projectsArray, this.callbackFunction);
    }

    // load a list fo projects from info.json
    Projects.prototype.loadProjectsFromProjectNames = function (projectsArray, callbackFunction) {
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

    // load a list fo projects from info.json
    Projects.prototype.loadProjectsFromProjectArray = function (projectsArray) {
        this.projects = projectsArray;
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

    Projects.prototype.getMostRecentProject = function () {
        console.log("getMostRecentProject");
        var projectIndex = this.getMostRecentProjectIndex();
        return this.projects[projectIndex];
    }

    Projects.prototype.getMostRecentProjectIndex = function () {
        console.log("getMostRecentProjectIndex");
        var mostRecentProjectIndex = null;
        var mostRecentUpdated = new Date("1/1/1800");

        for (var t = 0; t < this.projects.length; t++) {
            var curUpdated = this.projects[t].updated();
            console.log("comparing: " + curUpdated + " to " + mostRecentUpdated);
            if (curUpdated > mostRecentUpdated) {
                console.log("was newer");
                mostRecentUpdated = curUpdated;
                mostRecentProjectIndex = t;
            }
        }
        return mostRecentProjectIndex;
    }

    Projects.prototype.sortByUpdated = function () {

        var sortedProjects = [];

        var emg = 0;

        while (this.projects.length > 0) {
            console.log("projectsLength" + this.projects.length);

            // get most recent project index
            var index = this.getMostRecentProjectIndex();

            // add project to sorted list
            sortedProjects[sortedProjects.length] = this.projects[index];

            // remove project from projects
            if (index > -1) this.projects.splice(index, 1);

            emg++;
            if (emg > 100) break;
        }

        this.projects = sortedProjects;
    }

    Projects.prototype.search = function (searchString) {

        // return all when no search is specified
        if (searchString == null) {
            return this;
        }

        // loop thorugh each project and execute search
        var filteredProjects = [];
        for (var p = 0; p < this.projects.length; p++) {

            // if the project matches the filters.
            var searchResults = this.projects[p].search(searchString);
            if (searchResults > 0) {
                filteredProjects[filteredProjects.length] = this.projects[p]
            }
        }

        var filteredProjectsObj = new Projects();
        filteredProjectsObj.loadProjectsFromProjectArray(filteredProjects);
        return filteredProjectsObj;
    }
}