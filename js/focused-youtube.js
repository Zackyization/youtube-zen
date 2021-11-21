const YOUTUBE_BROWSING_AREA = document.getElementsByTagName("ytd-browse")[0];

function handleResponse(message) {
    console.log(`Message from the background script:  ${message.response}`);
}

function handleError(error) {
    console.log(`Error: ${error}`);
}

function notifyBackgroundPage(e) {
    let sending = browser.runtime.sendMessage({
        focus_mode: true
    });
    sending.then(handleResponse, handleError);
}

window.addEventListener("load", notifyBackgroundPage);

browser.runtime.onMessage.addListener((message) => {
    if (message.command === "focus") {
        //Insert the focus styling
        YOUTUBE_BROWSING_AREA.textContent = ''; //wipes the browse section on the home page

        //Remove the youtube home page area and insert an indicator that the extension is enabled.
        YOUTUBE_BROWSING_AREA.innerHTML = `<div id="focused-youtube-area">
                                                <h1>Productivity Mode enabled.</h1>
                                            </div>`;
    } else if (message.command === "unfocus") {
        //remove the focus styling
    }
});




/*
TODO: Web extension popup menu that lets users toggle between productivity mode on/off.
TODO: Remove the recommended videos section on a video page. (The page where you actually watch a video)
NOTE: https://addons.mozilla.org/en-US/firefox/addon/df-youtube/, research the existing solutions,
see what you can do to improve on it
NOTE: https://github.com/mdn/webextensions-examples for all your referential needs
*/