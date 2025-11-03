var documents = require("./documents");

function convertElementToRawText(element) {
    if (element.type === "text") {
        return element.value;
    } else if (element.type === documents.types.tab) {
        return "\t";
    } else {
        var tail = element.type === "paragraph" ? "\n\n" : "";
        return (element.children || []).map(convertElementToRawText).join("") + tail;
    }
}

function convertElementToRawTextWithColor(element, currentColor) {
    currentColor = currentColor || null;

    if (element.type === "text") {
        return [{
            text: element.value,
            color: currentColor
        }];
    } else if (element.type === documents.types.tab) {
        return [{
            text: "\t",
            color: currentColor
        }];
    } else if (element.type === documents.types.run) {
        // Update color for this run
        var runColor = element.color || currentColor;
        var runResults = [];
        (element.children || []).forEach(function(child) {
            runResults = runResults.concat(convertElementToRawTextWithColor(child, runColor));
        });
        return runResults;
    } else {
        var elementResults = [];
        (element.children || []).forEach(function(child) {
            elementResults = elementResults.concat(convertElementToRawTextWithColor(child, currentColor));
        });

        if (element.type === "paragraph" && elementResults.length > 0) {
            elementResults.push({
                text: "\n\n",
                color: null
            });
        }

        return elementResults;
    }
}

exports.convertElementToRawText = convertElementToRawText;
exports.convertElementToRawTextWithColor = convertElementToRawTextWithColor;
