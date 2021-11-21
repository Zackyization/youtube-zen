const YOUTUBE_HOME_STYLE = "style/youtube-home.css";
const YOUTUBE_VIDEO_STYLE = "style/youtube-video.css";
/*
NOTE: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Working_with_the_Tabs_API for reference
NOTE: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/insertCSS, more reference
NOTE: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#communicating_with_background_scripts, more reference
    https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/executeScript for executing a content script on a specific tab(s). [For youtube Tabs?]
TODO: Add CSS only when domain name is youtube.com
*/

function injectCSS(message) {
    if (message === "connected") {
        //prepare the css in the message to be sent back to the content script
    }
}

browser.runtime.onMessage.addListener(notify);

function notify(message) {
    console.log({"Message": message});
}

//connect to the background script
//NOTE: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#connection-based_messaging, this section explains the messaging procedure