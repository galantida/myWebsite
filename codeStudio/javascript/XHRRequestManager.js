/********************** XHRRequestManager *******************************
 * 
 * XHRRequestManager.request - Basic XHR request with some added functionality.
 * = Parameters =
 * serviceURL - pass the url to call.
 * callbackfunction (optional) - function to be called when the response comes back.
 * extraInfo (optional)- info to be passed to the callback function. html control ID, object names etc...
 * addToBatch (true/false/optional) - If it should be added to a running batch.
 * 
 * = Basic usage =
 * rm.request("html/header.html");
 * 
 * = Usage with callback =
 * rm.request("html/header.html", callback);
 * 
 * = Usage with callback and extraInfo =
 * rm.request("html/header.html", callback, "header");
 * 
 * = Usage from with in another protoytpe =
 * this.rm.request("html/header.html", this.internalCallback.bind(this));
 * 
 * XHR Batch - Signifies the start a batch of XHR calls.
 * all requests from this point further with addToBatch set to true will be added to this batch.
 * = Parameters =
 * batchCallbackFunction (optional) - function to be called when all responses have come back.
 * 
 * = Batch Usage =
 * rm.setBatchCallback(batchCallback);
 * rm.request("html/header.html", callback, true, "header");
 * rm.request("html/footer.html", callback, true, "footer");
  * 
 * = Batch Usage from within another prototype =
 * this.rm = new XHRRequestManager();
 * this.rm.setBatchCallback(this.internalBatchCallback.bind(this));
 * this.rm.request("html/header.html", this.internalCallback.bind(this), "header", true);
 * this.rm.request("html/footer.html", this.internalCallback.bind(this), "footer", true);
 
********************************************************************/

function XHRRequestManager() {
    this.pendingRequests = 0; // batch requests still pending
    this.batchCallbackFunction = null; // callers callback function to call when the current batch has completed

    // start a batch
    XHRRequestManager.prototype.setBatchCallback = function (batchCallbackFunction) {
        if ((batchCallbackFunction) && (typeof batchCallbackFunction != "function")) {
            console.error("XHRMgr: The \"XHRRequestManager.setBatchCallback\" function parameter \"batchCallbackFunction\" requires a function. \"" + batchCallbackFunction + "\" is not a function.");
            return;
        }

        console.log("XHRMgr: Starting XHR batch request.")
        this.batchCallbackFunction = batchCallbackFunction;
    }

    // basic xhr request
    XHRRequestManager.prototype.request = function (serviceURL, callbackFunction, extraInfo, addToBatch) {
        if (callbackFunction == null) callbackFunction = this.defaultCallback;
        else
        {
            if ((callbackFunction) && (typeof callbackFunction != "function")) {
                console.error("XHRMgr: The \"XHRRequestManager.request\" function parameter \"callbackFunction\" requires a function. \"" + callbackFunction + "\" is not a function.");
                return;
            }
        }

        if (!addToBatch) console.log("XHRMgr: Sending request to '" + serviceURL + "'.");
        else {
            this.pendingRequests++;
            console.log("XHRMgr: Sending batch request (" + this.pendingRequests + ") to '" + serviceURL + "'.");
        }


        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.onreadystatechange = function () {

            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

                if (addToBatch) console.log("XHRMgr: Receiving response (" + this.pendingRequests + ").");
                else console.log("XHRMgr: Receiving response.");

                // callback function is always called. Custom or default
                if (callbackFunction != null) callbackFunction(xhr.responseText, extraInfo);
                else this.defaultCallback(xhr.responseText, extraInfo);

                if (addToBatch) {
                    // batch response
                    this.pendingRequests--;

                    if (this.pendingRequests == 0) {
                        console.log("XHRMgr: Batch request complete.");
                        if (this.batchCallbackFunction != null) this.batchCallbackFunction(xhr.responseText);
                        this.batchCallbackFunction = null;
                    }
                }
            }
        }.bind(this);

        xhr.open("GET", serviceURL, true);
        xhr.send(null);
    }

    // default callback that is called when a user does not supply one
    XHRRequestManager.prototype.defaultCallback = function (responseText, extraInfo) {
        console.log("XHRMgr: defaultCallback.");
        // do nothing. unhandled response
    }
}