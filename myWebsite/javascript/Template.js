function Template(name, url, template) {

    this.name = name;
    this.url = url;
    this.template = template;

    Template.prototype.populated = function (content) {
        return this.replaceWithObject(null, content, this.template);
    }

    Template.prototype.appendTag = function (tagName, appendage) {
        if (tagName == null) return appendage;
        else return tagName + "." + appendage;
    }

    Template.prototype.replaceWithUnknown = function (tagName, unknown, template) {

        if (unknown == null) unknown = "";

        switch (typeof unknown) {
            case "string":
            case "boolean":
                {
                    //console.log("is primitive"); // primitve
                    return this.replaceWithValue(tagName, unknown, template);
                }
            case "object":
                {
                    //console.log("is object"); // object
                    return this.replaceWithObject(tagName, unknown, template);
                }
            case "array":
                {
                    //console.log("is array"); // array
                    return this.replaceWithArray(tagName, unknown, template);
                }
            default:
                {
                    console.warn("Unhandled replacement type (" + typeof unknown + ")."); // array
                    return template; // unchanged
                }
        }
    }

    Template.prototype.replaceWithArray = function (tagName, array, template) {
        var populatedTemplate = template;

        for (var t = 0; t < array.length; t++) {
            var newTagName = this.appendTag(tagName, t);
            populatedTemplate = replaceWithUnknown(tagName, array[t], populatedTemplate);
        }
        return populatedTemplate;
    }

    Template.prototype.replaceWithObject = function (tagName, object, template) {
        var populatedTemplate = template;
        var keys = Object.keys(object);
        for (var k = 0; k < keys.length; k++) {
            var newTagName = this.appendTag(tagName, keys[k]);
            populatedTemplate = this.replaceWithUnknown(newTagName, object[keys[k]], populatedTemplate);
        };
        return populatedTemplate;
    }

    Template.prototype.replaceWithValue = function (tagName, value, template) {
        //console.log("replacing '[" + tagName + "]' with '" + value + "'.");
        return template.replaceAll("[" + tagName + "]", value);
    }
    


}