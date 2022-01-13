const FOCUSED_YT_TOGGLE = document.getElementById("focused-toggle");

/**
 * Toggle material toggle span element switch
 */
let toggleElements = document.getElementsByClassName("toggle");
let toggleFunction = (e) => {
    //search siblings for the checkbox input, toggle it upon click
    let toggleCheckbox = e.originalTarget.parentNode.firstElementChild;
    let event = new Event("change");
    toggleCheckbox.checked = !toggleCheckbox.checked;
    toggleCheckbox.dispatchEvent(event);
}

function onError(error) {
    console.error(`${error}`);
}

// TODO: Implementation of storage.sync in the future, use storage.local for now
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
    }, onError);
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
    switch (option) {
        case "extension-toggle":
            return browser.storage.local.set({
                "extension-toggle" : FOCUSED_YT_TOGGLE.id
            });

            //TODO: Implement the other options into this switch statement
    }
}

/**
 * Remove an option in into the browser local StorageArea
 */
function removeStorageOption(option) {
    return browser.storage.local.remove(option);
}

/**
 * Enable or disable focused youtube functionality
 */
FOCUSED_YT_TOGGLE.addEventListener("change", () => {
    let querying = queryYoutubeTabs();
    let keyName = "extension-toggle";

    //TODO: Find a way to implement promise chaining to fix the double refresh bug
    if (FOCUSED_YT_TOGGLE.checked) {
        //save then query
        let savingOption = saveStorageOption(keyName);
        savingOption.then(() => {
                return querying;
            })
            .then((tabs) => {
                for (let tab of tabs) {
                    browser.tabs.sendMessage(tab.id, {
                        command: "extension-enabled"
                    })
                }
            }, onError);
    } else {
        let removingOption = removeStorageOption(keyName);
        removingOption.then(() => {
                return querying;
            })
            .then((tabs) => {
                //disable the extension functionality
                for (let tab of tabs) {
                    browser.tabs.sendMessage(tab.id, {
                        command: "extension-disabled"
                    })
                }
            });
    }
});


Array.from(toggleElements).forEach((e) => {
    e.addEventListener("click", toggleFunction);
});
initialize();