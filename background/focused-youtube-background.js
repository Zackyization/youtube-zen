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

function handleActivated(activeTab) {
    //TODO: onActivated event to handle youtube tabs not activated with the functionality yet
}

function handleUpdated(tabId, changeInfo, tabInfo) {
    //execute the pop up script
    // executingPopupScript.then(onExecuted, onError);
}

function getUserChoices() {
    let gettingUserChoices = browser.storage.local.get();
    gettingUserChoices.then((results) => {
        userChoices = Object.keys(results);
        return Promise.resolve("done");
    }, onError);
}

//TODO: Evaluate whether you still need these 2 functions
// browser.tabs.onUpdated.addListener(handleUpdated, filter);
// browser.tabs.onActivated.addListener(handleActivated);


browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "CHECK_OPTIONS") {
        //based on local storage result, activate or disbale the extention accordingly

        ///LEFT OFF HERE, NOTE: this link should help https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#sending_an_asynchronous_response_using_sendresponse
        getUserChoices();
        console.log(userChoices);
        if (userChoices !== 0) {
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
    }
});