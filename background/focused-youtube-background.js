const YOUTUBE_URL_PATTERN = "*://*.youtube.com/*";
const filter = {
    urls: [YOUTUBE_URL_PATTERN],
};
const executingPopupScript = browser.tabs.executeScript({
    file: "/popup/focused-youtube-popup.js",
    allFrames: true,
});

function onError(error) {
    console.error(`${error}`);
}

function getUserChoices() {
    return browser.storage.local.get();
}

browser.runtime.onMessage.addListener(
    (request, sender) => {
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
        }
    }
);