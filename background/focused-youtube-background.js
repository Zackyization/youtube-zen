const YOUTUBE_URL_PATTERN = "*://*.youtube.com/*";
const YOUTUBE_WATCH_URL_PATTERN = "*://*.youtube.com/watch*"
const filter = {
    urls: [YOUTUBE_URL_PATTERN, YOUTUBE_WATCH_URL_PATTERN],
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
        case "focused-toggle":
            return browser.storage.local.set({
                "focused-toggle": request.inputID
            });

        case "home-toggle":
            return browser.storage.local.set({
                "home-toggle": request.inputID
            });

        case "suggestions-toggle":
            return browser.storage.local.set({
                "suggestions-toggle": request.inputID
            });

        case "comments-toggle":
            return browser.storage.local.set({
                "comments-toggle": request.inputID
            });

        case "in-video-toggle":
            return browser.storage.local.set({
                "in-video-toggle": request.inputID
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
        code: "checkUserOptions()"
    });
    executing.then(() => {
        console.log("Updated executed!");
    }, handleError);
}

function processRequest(request) {
    let querying = queryYoutubeTabs();

    if (request.message === "CHECK_OPTIONS") {
        let tabs;
        querying.then((result) => {
                tabs = result;
                return getUserChoices();
            }, onError)
            .then((results) => {
                return Object.keys(results);
            }, onError)
            .then((enabledOptions) => {
                let cmd;
                enabledOptions.forEach(option => {
                    switch (option) {
                        case "focused-toggle":
                            cmd = "focused-enabled"
                            break;

                        case "home-toggle":
                            cmd = "home-enabled"
                            break;

                        case "suggestions-toggle":
                            cmd = "suggestions-enabled"
                            break;

                        case "comments-toggle":
                            cmd = "comments-enabled";
                            break;

                        case "in-video-toggle":
                            cmd = "in-video-enabled";
                            break;

                        default:
                            cmd = "focused-disabled"
                            break;
                    }

                    for (let tab of tabs) {
                        browser.tabs.sendMessage(tab.id, {
                            command: cmd
                        });
                    }
                });
            }, onError);
        return Promise.resolve({
            response: "check-user-options-processed"
        });
    } else if (request.message === "CHECK_VIDEO_SUGGESTIONS_ENABLED") {
        let cmd;
        let gettingUserChoices = getUserChoices();
        gettingUserChoices.then((usrChoices) => {
                if (usrChoices.hasOwnProperty("focused-toggle") || usrChoices.hasOwnProperty("suggestions-toggle")) {
                    cmd = "check-video-suggestions-enabled-found";
                }

                return querying;
            }, onError)
            .then((tabs) => {
                for (let tab of tabs) {
                    browser.tabs.sendMessage(tab.id, {
                        command: cmd
                    });
                }
            }, onError);


        return Promise.resolve({
            response: "check-video-suggestions-processed"
        });
    } else {
        let requestMsg = request.message.command;
        let option = request.message.content;
        let cmd;

        if (requestMsg === "FOCUSED_ENABLE" ||
            requestMsg === "HOME_ENABLE" ||
            requestMsg === "SUGGESTIONS_ENABLE" ||
            requestMsg === "COMMENTS_ENABLE" ||
            requestMsg === "IN_VIDEO_ENABLE") {
            //requests that enable
            switch (requestMsg) {
                case "FOCUSED_ENABLE":
                    cmd = "focused-enabled";
                    break;

                case "HOME_ENABLE":
                    cmd = "home-enabled";
                    break;

                case "SUGGESTIONS_ENABLE":
                    cmd = "suggestions-enabled";
                    break;

                case "COMMENTS_ENABLE":
                    cmd = "comments-enabled";
                    break;

                case "IN_VIDEO_ENABLE":
                    cmd = "in-video-enabled";
                    break;
            }

            return saveStorageOption(option)
                .then(() => {
                    return querying
                }, onError)
                .then((tabs) => {
                    for (let tab of tabs) {
                        browser.tabs.sendMessage(tab.id, {
                            command: cmd
                        });
                    }
                }, onError)
                .then(() => {
                    return Promise.resolve({
                        response: "save-success"
                    });
                }, onError);
        } else {
            //requests that disable
            switch (requestMsg) {
                case "FOCUSED_DISABLE":
                    cmd = "focused-disabled"
                    break;

                case "HOME_DISABLE":
                    cmd = "home-disabled"
                    break;

                case "SUGGESTIONS_DISABLE":
                    cmd = "suggestions-disabled"
                    break;

                case "COMMENTS_DISABLE":
                    cmd = "comments-disabled";
                    break;

                case "IN_VIDEO_DISABLE":
                    cmd = "in-video-disabled";
                    break;
            }

            return removeStorageOption(option)
                .then(() => {
                    return querying;
                }, onError)
                .then((tabs) => {
                    for (let tab of tabs) {
                        browser.tabs.sendMessage(tab.id, {
                            command: cmd
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
}

browser.runtime.onMessage.addListener(processRequest);
browser.tabs.onUpdated.addListener(handleUpdated, filter);