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
    console.log(`Error: ${error}`);
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

/**
 * Enable or disable focused youtube functionality
 */
FOCUSED_YT_TOGGLE.addEventListener("change", () => {
    let querying = browser.tabs.query({
        url: "*://*.youtube.com/*"
    });

    if (FOCUSED_YT_TOGGLE.checked) {
        //enable the extension functionality
        querying.then((tabs) => {
            for (let tab of tabs) {
                browser.tabs.sendMessage(tab.id, {
                    command: "extension-enabled"
                })
            }
        }, onError);

        let saveOption = browser.storage.local.set({
            "toggle": FOCUSED_YT_TOGGLE.id
        });
        saveOption.then(() => {
            console.log("YT-FOCUSED: Enabled setting saved!");
        }, onError)
    } else {
        //disable the extension functionality
        querying.then((tabs) => {
            for (let tab of tabs) {
                browser.tabs.sendMessage(tab.id, {
                    command: "extension-disabled"
                })
            }
        }, onError);

        let removeOption = browser.storage.local.remove("toggle");
        removeOption.then(() => {
            console.log("YT-FOCUSED: Enabled setting removed!");
        }, onError);
    }
});


Array.from(toggleElements).forEach((e) => {
    e.addEventListener("click", toggleFunction);
});
initialize();
