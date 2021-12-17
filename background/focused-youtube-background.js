//TODO:When a youtube tab loads, load the script in the pop up menu to load the javascript.
////NOTE: USE THE TABS API TO PULL OFF THE ABOVE TASK, https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onCreated
//https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onUpdated
const YOUTUBE_URL_PATTERN = "*://*.youtube.com/*";

const filter = {
    urls: [YOUTUBE_URL_PATTERN]
}


function handleCreated(tab) {

}

function handleUpdated(tabId, changeInfo, tabInfo) {
    /// LEFT OFF HERE, refer to the onUpdated tab to continue from where you left off
    //if changeInfo matches to a youtube URL, execute popup script
    if (changeInfo.url) {
        
    }
}

browser.tabs.onUpdated.addListener(handleUpdated);

//TODO: Do I need to handle an onCreated event?
browser.tabs.onCreated.addUpdated(tabCreated);