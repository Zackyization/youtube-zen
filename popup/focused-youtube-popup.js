const TOGGLES = document.querySelectorAll('.option-toggle');

/**
 * Toggle material toggle span element switch
 */
/// TODO: Make it so that when a custom toggle is switched to ON, the focused-only switch turns off
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
function saveStorageOption(option, el_ID) {
    let sendingSaveCommand;
    let cmd;
    switch (option) {
        case "focused-toggle":
            cmd = "FOCUSED_ENABLE";
            break;
        
        case "home-toggle":
            cmd = "HOME_ENABLE";
            break;
    }

    sendingSaveCommand = browser.runtime.sendMessage({
        message: {
            command: cmd,
            content: {
                keyName: option,
                inputID: el_ID
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
    let sendingRemoveCommand;
    let cmd;

    switch (option) {
        case "focused-toggle":
            cmd = "FOCUSED_DISABLE";
            break;
        
        case "home-toggle":
            cmd = "HOME_DISABLE";
            break;
    }

    sendingRemoveCommand = browser.runtime.sendMessage({
        message: {
            command: cmd,
            content: option
        }
    });
    sendingRemoveCommand.then(handleResponse, handleError);
}

TOGGLES.forEach(el => el.addEventListener('change', event => {
    let keyName = el.name;
    if (el.checked) {
        //enable
        saveStorageOption(keyName, el.id);
    } else {
        //disable
        removeStorageOption(keyName);
    }
}));

Array.from(toggleElements).forEach((e) => {
    e.addEventListener("click", toggleFunction);
});
initialize();