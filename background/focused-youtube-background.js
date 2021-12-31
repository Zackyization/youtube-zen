const YOUTUBE_URL_PATTERN = "*://*.youtube.com/*";
const filter = {
    urls: [YOUTUBE_URL_PATTERN],
};
const executingPopupScript = browser.tabs.executeScript({
    file: "/popup/focused-youtube-popup.js",
    allFrames: true,
});
var userChoices;

function onExecuted(result) {
    console.log("Script executed!");
}

function onError(error) {
    console.log(`Error: ${error}`);
}

function getUserChoices() {
    let gettingUserChoices = browser.storage.local.get();
    gettingUserChoices.then((results) => {
        userChoices = Object.keys(results);
    }, onError);
}

// function handleActivated(activeTab) {
//     //TODO: onActivated event to handle youtube tabs not activated with the functionality yet
// }

// function handleUpdated(tabId, changeInfo, tabInfo) {
//     //execute the pop up script
//     // executingPopupScript.then(onExecuted, onError);
// }

//TODO: Evaluate whether you still need these 2 functions
// browser.tabs.onUpdated.addListener(handleUpdated, filter);
// browser.tabs.onActivated.addListener(handleActivated);


browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "CHECK_OPTIONS") {
        //based on local storage result, activate or disable the extension accordingly
        getUserChoices();
        if (userChoices.length !== 0) {
            return Promise.resolve({
                command: "extension-enabled"
            })
        } else {
            //disable the extension
            return Promise.resolve({
                command: "extension-disabled"
            })
        }
    }
});