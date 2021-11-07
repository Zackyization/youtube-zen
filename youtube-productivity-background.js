const YOUTUBE_DOMAIN = new RegExp("*://*.youtube.com/*");
const YOUTUBE_HOME_STYLE = "youtube-home.css";
const YOUTUBE_VIDEO_STYLE = "youtube-video.css";

/*
NOTE: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Working_with_the_Tabs_API for reference
NOTE: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/insertCSS, more reference
NOTE: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onUpdated, more reference
TODO: Add CSS only when domain name is youtube.com
*/

function initializePageAction(tab) {
    console.log("Updated tab: " + tabId);
    console.log("Changed attributes: ");
    console.log(changeInfo);
    console.log("New tab Info: ");
    console.log(tabInfo);
    if (isItYoutube(tab)) {
        //inject css
        function onError(error) {
            console.log(`Error: ${error}`);
        }

        let insertingCSS = browser.tabs.insertCSS(2, {
            file: YOUTUBE_HOME_STYLE
        });
        insertingCSS.then(null, onError);
    }
}

function isItYoutube(tab) {
    return YOUTUBE_DOMAIN.test(tab.url);
}

/*
When first loaded, initialize the extension
*/

var gettingAllTabs = browser.tabs.query({});
console.log(gettingAllTabs);
gettingAllTabs.then((tabs) => {
    for (let tab of tabs) {
        console.log(tab);
        initializePageAction(tab);
    }
});


/*
Each time a tab is updated, reinitialize the page action for that tab.
*/
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
    initializePageAction(tab);
});