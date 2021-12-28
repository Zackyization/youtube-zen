const YOUTUBE_URL_PATTERN = "*://*.youtube.com/*";
const filter = {
    urls: [YOUTUBE_URL_PATTERN],
};
const executingPopupScript = browser.tabs.executeScript({
    file: "/popup/focused-youtube-popup.js",
    allFrames: true,
});

function onExecuted(result) {
    console.log("Script executed!");
}

function onError(error) {
    console.log(`Error: ${error}`);
}

function handleActivated(activeTab) {
    //TODO: onActivated event to handle youtube tabs not activated with the functionality yet
}

function handleUpdated(tabId, changeInfo, tabInfo) {
    //execute the pop up script
    // executingPopupScript.then(onExecuted, onError);
}

//TODO: Evaluate whether you still need these 2 functions
// browser.tabs.onUpdated.addListener(handleUpdated, filter);
// browser.tabs.onActivated.addListener(handleActivated);


browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "CHECK_OPTIONS") {
        //send a response back to trigger the distraction removal
        //based on local storage result, activate or disbale the extention accordingly
        let gettingUserChoices = browser.storage.local.get(null);
        gettingUserChoices.then((results) => {
            let options = Object.keys(results);
            if (options.length !== 0) {
                //enable the extension
                sendResponse({
                    command: "enable-user-options"
                });
            } else {
                //disable the extension
                sendResponse({
                    command: "disable-user-options"
                });
            }
        }, onError);
    }
});