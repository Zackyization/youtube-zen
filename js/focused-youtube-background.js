const YOUTUBE_HOME_STYLE = "style/youtube-home.css";
const YOUTUBE_VIDEO_STYLE = "style/youtube-video.css";
/*
NOTE: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/insertCSS, more reference
TODO: Add CSS only when domain name is youtube.com
//NOTE: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#connection-based_messaging, this section explains the messaging procedure
NOTE: https: //extensionworkshop.com/documentation/develop/debugging/#debugging-background-scripts
*/

function injectCSS(message) {
    if (message === "connected") {
        //prepare the css in the message to be sent back to the content script
    }
}

function listenForClicks() {
    document.addEventListener("click", (e) => {
        console.log(e);
    })
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
    alert("Focused YT: " + error.message);
    console.error(`Failed to execute beastify content script: ${error.message}`);
}


/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({
        file: "/content_scripts/focused-youtube.js"
    })
    .then(listenForClicks)
    .catch(reportExecuteScriptError);