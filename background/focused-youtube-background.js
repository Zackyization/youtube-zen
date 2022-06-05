const YOUTUBE_URL_PATTERN = "*://*.youtube.com/*";
const YOUTUBE_WATCH_URL_PATTERN = "*://*.youtube.com/watch*"
const filter = {
    urls: [YOUTUBE_URL_PATTERN,YOUTUBE_WATCH_URL_PATTERN],
};

let userChoices = [];

function onError(error) {
    console.error(`${error}`);
}

function getUserChoices() {
    return browser.storage.local.get();
}

function removeStorageOption(request) {
    return browser.storage.local.remove(request);
}

function saveStorageOption(request) {
    switch (request.keyName) {
        case "extension-toggle":
            return browser.storage.local.set({
                "extension-toggle": request.inputID
            });
    }
}

function queryYoutubeTabs() {
    return browser.tabs.query({
        url: "*://*.youtube.com/*"
    });
}

function handleUpdated(tabId, changeInfo, tabInfo) {
    //check whether url is home page or watch page
    let executing = browser.tabs.executeScript(tabId, {
        code: "checkUserOptions();"
    });
    executing.then(() => {
        console.log("Updated executed!", handleError)
    });
}

function processRequest(request) {
    if (request.message === "CHECK_OPTIONS") {
        return getUserChoices()
            .then((results) => {
                return Object.keys(results);
            })
            .then((keys) => {
                if (keys.length !== 0) {
                    return Promise.resolve({
                        command: "extension-enabled"
                    });
                } else {
                    return Promise.resolve({
                        command: "extension-disabled"
                    });
                }
            });
    } else if (request.message.command === "SAVE_OPTION") {
        //enabling the extension
        let querying = queryYoutubeTabs();
        let option = request.message.content;
        return saveStorageOption(option)
            .then(() => {
                return querying
            }, onError)
            .then((tabs) => {
                for (let tab of tabs) {
                    browser.tabs.sendMessage(tab.id, {
                        command: "extension-enabled"
                    });
                }
            }, onError)
            .then(() => {
                return Promise.resolve({
                    response: "save-success"
                });
            }, onError);
    } else if (request.message.command === "REMOVE_OPTION") {
        //disabling the extension
        let querying = queryYoutubeTabs();
        let option = request.message.content;
        return removeStorageOption(option)
            .then(() => {
                return querying
            }, onError)
            .then((tabs) => {
                for (let tab of tabs) {
                    browser.tabs.sendMessage(tab.id, {
                        command: "extension-disabled"
                    });
                }
            }, onError)
            .then(() => {
                return Promise.resolve({
                    response: "remove-success"
                });
            }, onError);
    }
}

browser.runtime.onMessage.addListener(processRequest);
browser.tabs.onUpdated.addListener(handleUpdated, filter);