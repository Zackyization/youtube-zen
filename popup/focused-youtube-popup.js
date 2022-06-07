const FOCUSED_YT_TOGGLE = document.getElementById("focused-toggle");

/**
 * Toggle material toggle span element switch
 */
//TODO: CURRENT: Get multiple toggle option saving to work
let toggleElements = document.getElementsByClassName("toggle");
let toggleFunction = (e) => {
    //search siblings for the checkbox input, toggle it upon click
    let toggleCheckbox = e.originalTarget.parentNode.firstElementChild;
    let event = new Event("change");
    toggleCheckbox.checked = !toggleCheckbox.checked;
    toggleCheckbox.dispatchEvent(event);
}

function handleError(error) {
    console.error(`${error}`);
}

function handleResponse(message) {
    //TODO: Write code to make the pop up react to the messages?
    if (message.response === "save-success") {
        console.log("SAVE SUCCESSFUL!");
    } else if (message.response === "remove-success") {
        console.log("REMOVE SUCCESSFUL!");
    }
}


function initialize() {
    /**
     * Toggles the checkboxes accordingly based on user's last saved settings
     */
    let gettingUserChoices = browser.storage.local.get();
    gettingUserChoices.then((results) => {
        let options = Object.keys(results);
        for (let option of options) {
            let toggle = document.getElementById(results[option]);
            toggle.checked = true;
            let event = new Event("change");
            toggle.dispatchEvent(event);
        }
    }, handleError);
}

function queryYoutubeTabs() {
    return browser.tabs.query({
        url: "*://*.youtube.com/*"
    });
}

/**
 * Save an option in into the browser local StorageArea
 */
function saveStorageOption(option) {
    let sendingSaveCommand = browser.runtime.sendMessage({
        message: {
            command: "SAVE_OPTION",
            content: {
                keyName: option,
                inputID: FOCUSED_YT_TOGGLE.id
            }
        }
    });
    sendingSaveCommand.then(handleResponse, handleError);
}

/**
 * Remove an option in into the browser local StorageArea
 */
function removeStorageOption(option) {
    //send a signal to the background script
    let sendingRemoveCommand = browser.runtime.sendMessage({
        message: {
            command: "REMOVE_OPTION",
            content: option
        }
    });
    sendingRemoveCommand.then(handleResponse, handleError);
}

/**
 * Enable or disable focused youtube functionality
 */
FOCUSED_YT_TOGGLE.addEventListener("change", () => {
    let keyName = "extension-toggle";

    if (FOCUSED_YT_TOGGLE.checked) {
        //extension enabled
        saveStorageOption(keyName);
    } else {
        //extension disabled 
        removeStorageOption(keyName);
    }
});


Array.from(toggleElements).forEach((e) => {
    e.addEventListener("click", toggleFunction);
});
initialize();