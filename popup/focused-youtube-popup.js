const TOGGLES = document.querySelectorAll('.option-toggle');

/**
 * Toggle material toggle span element switch
 */
let toggleElements = document.getElementsByClassName("toggle");
let toggleFunction = (e) => {
    //search siblings for the checkbox input, toggle it upon click
    let targetToggle = e.originalTarget.parentNode.firstElementChild;
    let event = new Event("change");

    //if turning on master switch while other toggles are turned on, turn off other toggles
    if (targetToggle.id === "focused-toggle") {
        if (targetToggle.checked === false) {
            //when master switch is off, turn on the master switch and turn off the other switches
            let checkedToggles = document.querySelectorAll(".option-toggle:checked");
            checkedToggles.forEach((toggle) => {
                toggle.checked = false;
                toggle.dispatchEvent(event);
            });
            targetToggle.checked = true;
            targetToggle.dispatchEvent(event);
        } else {
            //when master switch is on, turn it off
            targetToggle.checked = false;
            targetToggle.dispatchEvent(event);
        }
    } else {
        //if master switch is on and user clicks on custom switch, turn master switch off
        let masterSwitch = document.getElementById("focused-toggle");
        if (masterSwitch.checked === true) {
            masterSwitch.checked = false;
            masterSwitch.dispatchEvent(event);
        }
        targetToggle.checked = !targetToggle.checked;
        targetToggle.dispatchEvent(event);
    }
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

        case "comments-toggle":
            cmd = "COMMENTS_ENABLE";
            break;

        case "suggestions-toggle":
            cmd = "SUGGESTIONS_ENABLE";
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

        case "comments-toggle":
            cmd = "COMMENTS_DISABLE";
            break;

        case "suggestions-toggle":
            cmd = "SUGGESTIONS_DISABLE";
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

TOGGLES.forEach((el) => {
    el.onchange = (evt) => {
        let keyName = evt.target.name;
        if (evt.target.checked === true) {
            //enable
            saveStorageOption(keyName, evt.target.id);
        } else {
            //disable
            removeStorageOption(keyName);
        }
    }
})

Array.from(toggleElements).forEach((e) => {
    e.addEventListener("click", toggleFunction);
});
initialize();