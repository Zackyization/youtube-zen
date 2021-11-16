let ytBrowse = document.getElementsByTagName("ytd-browse")[0];
ytBrowse.textContent = ''; //wipes the browse section on the home page
function handleResponse(message) {
    console.log(`Message from the background script:  ${message.response}`);
}

function handleError(error) {
    console.log(`Error: ${error}`);
}

function notifyBackgroundPage(e) {
    let sending = browser.runtime.sendMessage({
        greeting: "Greeting from the content script"
    });
    sending.then(handleResponse, handleError);
}



//Remove the youtube home page area and insert an indicator that the extension is enabled.
ytBrowse.innerHTML = `<div id="focused-youtube-area">
    <h1>Productivity Mode enabled.</h1>
</div>`;

window.addEventListener("load",notifyBackgroundPage);







/*
TODO: Web extension popup menu that lets users toggle between productivity mode on/off.
TODO: Remove the recommended videos section on a video page. (The page where you actually watch a video)
NOTE: https://addons.mozilla.org/en-US/firefox/addon/df-youtube/, research the existing solutions,
see what you can do to improve on it
NOTE: https://github.com/mdn/webextensions-examples for all your referential needs
*/