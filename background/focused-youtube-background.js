const YOUTUBE_URL_PATTERN = "*://*.youtube.com/*";
const filter = {
    urls: [YOUTUBE_URL_PATTERN],
};
const executingPopupScript = browser.tabs.executeScript({
    file: "/popup/focused-youtube-popup.js",
    allFrames: true,
});
// var userChoices; TODO: Delete this line when you got the double refresh bug sorted out.

function onExecuted(result) {
    console.log("Script executed!");
}

function onError(error) {
    console.log(`Error: ${error}`);
}

function getUserChoices() {
    return browser.storage.local.get();
    // let gettingUserChoices = browser.storage.local.get();
    // gettingUserChoices.then((results) => {
    //     userChoices = Object.keys(results);
    // }, onError);
}

// function handleActivated(activeTab) {
//     //TODO: onActivated event to handle youtube tabs not activated with the functionality yet
// }

// function handleUpdated(tabId, changeInfo, tabInfo) {
//     //execute the pop up script
//     // executingPopupScript.then(onExecuted, onError);
// }

//TODO: Evaluate whether you still need these 2 functions
// browser.tabs.onUpdated.addListener(handleUpdated, filter);
// browser.tabs.onActivated.addListener(handleActivated);


browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let gettingUserChoices = getUserChoices();
    switch (request.message) {
        case "CHECK_OPTIONS":
            console.log("condition hit!");
            gettingUserChoices.then((results) => {
                return Object.keys(results);
            }).then((keys) => {
                /// LEFT OFF HERE, TODO: promise chain the functions by getting userchoices, checking the array length of the user choices then finally sending a messsage back to the content script
                if (keys.length !== 0) {
                    //enable extension
                    // sendResponse({
                    //     command: "extension-enabled"
                    // });
                    return Promise.resolve({
                        command: "extension-enabled"
                    });
                } else {
                    //disable extension
                    // sendResponse({
                    //     command: "extension-disabled"
                    // });
                    return Promise.resolve({
                        command: "extension-disabled"
                    });
                }
            })
            break;

        default:
            console.log("Message received from content script: " + request.message);
            break;
    }
}, onError);