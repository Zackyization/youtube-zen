//TODO:When a youtube tab loads, load the script in the pop up menu to load the javascript.
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
    //check if tab is in a youtube URL
    // let checkingUserOptions = browser.runtime.sendMessage({
    //     message: "ACTIVATE_FUNCTIONS"
    // });
    // checkingUserOptions.then(onExecuted, onError)
}

function handleUpdated(tabId, changeInfo, tabInfo) {
    // TODO:Figure out why the popup script doesn't get executed upon an updated event
    //execute the pop up script
    executingPopupScript.then(onExecuted, onError);
}

browser.tabs.onUpdated.addListener(handleUpdated, filter);
browser.tabs.onActivated.addListener(handleActivated);
//TODO: Make use of the onActivated event
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onActivated
// browser.tabs.onCreated.addUpdated(tabCreated);


browser.runtime.onMessage.addListener((request,sender,sendResponse) => {
    if (request.message === "CHECK_OPTIONS" || request.message === "ACTIVATE_FUNCTIONS") {
        //send a response back to trigger the distraction removal
        sendResponse({command: "enable-user-options"});
    }
});