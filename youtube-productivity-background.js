const CSS = `#youtube-productivity-tool-area { border: 5px solid red; }`;
//NOTE: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Working_with_the_Tabs_API for reference
//TODO: Add CSS only when domain name is youtube.com

/*
When first loaded, initialize the extension
*/

function initializePageAction(tab) {
    if (isItYoutube(tab.url)) {
        browser.pageAction.setIcon({
            tabId: tab.id,
            path: "icons/off.svg"
        });
        browser.pageAction.setTitle({
            tabId: tab.id,
            title: TITLE_APPLY
        });
        browser.pageAction.show(tab.id);
    }
}

function isItYoutube() {
    return tab.pageUrl
}