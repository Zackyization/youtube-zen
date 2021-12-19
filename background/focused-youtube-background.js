//TODO:When a youtube tab loads, load the script in the pop up menu to load the javascript.
////NOTE: USE THE TABS API TO PULL OFF THE ABOVE TASK, https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onCreated
//https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onUpdated
const YOUTUBE_URL_PATTERN = "*://*.youtube.com/*";

const filter = {
    urls: [YOUTUBE_URL_PATTERN]
}
const executingOnUpdatedScript = browser.tabs.executeScript({
    file: "/popup/focused-youtube-popup.js",
    allFrames: true
});

function onExecuted(result) {
    console.log("Script executed!");
}

function onError(error) {
    console.log(`Error: ${error}`);
}


function handleCreated(tab) {

}


function handleUpdated(tabId, changeInfo, tabInfo) {
    /// LEFT OFF HERE, figure out why the popup script doesn't get executed upon an updated event
    //execute the pop up script
    executingOnUpdatedScript.then(onExecuted, onError);
}

browser.tabs.onUpdated.addListener(handleUpdated, filter);

//TODO: Do I need to handle an onCreated event?
// browser.tabs.onCreated.addUpdated(tabCreated);