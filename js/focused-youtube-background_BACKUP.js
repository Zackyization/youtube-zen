const YOUTUBE_DOMAIN = new RegExp("*://*.youtube.com/*");
const YOUTUBE_HOME_STYLE = "style/youtube-home.css";
const YOUTUBE_VIDEO_STYLE = "style/youtube-video.css";
/*
NOTE: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Working_with_the_Tabs_API for reference
NOTE: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/insertCSS, more reference
NOTE: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#communicating_with_background_scripts, more reference
    https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/executeScript for executing a content script on a specific tab(s). [For youtube Tabs?]
TODO: Add CSS only when domain name is youtube.com
*/

console.log("background loaded!");

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

function handleMessage(request, sender, sendResponse) {
    console.log("Message from the content script: " +
        request.greeting);
    sendResponse({
        response: "Response from background script"
    });
}

browser.runtime.onMessage.addListener(handleMessage);

/*
When first loaded, initialize the extension
*/

//Check all tabs
//See which tabs has the youtube URL

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


//When a tab is updated, execute the "focus" script
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
    initializePageAction(tab);
});

browser.browserAction.onClicked.addListener(() => {
    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let querying = browser.tabs.query({
        //LEFT OFF HERE, figure out how to only query the tab IDs with youtube URLs
        // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/query
    });

    let insertingCSS = browser.tabs.insertCSS(2, {
        file: "css/youtube-home.css"
    });



    //LEFT OFF HERE, find a way to replace the '2' value with the tabID who's URL matches youtube
    insertingCSS.then(null, onError);
});