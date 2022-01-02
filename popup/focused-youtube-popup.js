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
    ///LEFT OFF HERE, find a way to implement promise chaining to fix the double refresh bug
    let tabs = querying.then((results) => results.json()).then((tabs)=> {
        console.log("Results: " + tabs);
    });
    

    if (FOCUSED_YT_TOGGLE.checked) {
        let savingOption = browser.storage.local.set({
            "extension-toggle": FOCUSED_YT_TOGGLE.id
        });
        savingOption.then(() => {
            console.log("YT-FOCUSED: Enabled setting saved!");
        }, onError)

        //enable the extension functionality
        querying.then((tabs) => {
            for (let tab of tabs) {
                browser.tabs.sendMessage(tab.id, {
                    command: "extension-enabled"
                })
            }
        }, onError);
    } else {
        let removingOption = browser.storage.local.remove("extension-toggle");
        removingOption.then(() => {
            console.log("YT-FOCUSED: Enabled setting removed!");
        }, onError);

        //disable the extension functionality
        querying.then((tabs) => {
            for (let tab of tabs) {
                browser.tabs.sendMessage(tab.id, {
                    command: "extension-disabled"
                })
            }
        }, onError);
    }

    // let debugGettingtAllLocalStorage = browser.storage.local.get();
    // let debuggingVariable;

    // debugGettingtAllLocalStorage.then((results) => {
    //     debuggingVariable = results;
    // }, onError)
    // console.log("Debugging Var: " + debuggingVariable);
});


Array.from(toggleElements).forEach((e) => {
    e.addEventListener("click", toggleFunction);
});
initialize();