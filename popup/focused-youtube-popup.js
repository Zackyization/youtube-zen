const FOCUSED_YT_TOGGLE = document.getElementById("focused-toggle");

/* Toggle material toggle span element switch */
let toggleElements = document.getElementsByClassName("toggle");
let switchElements = document.getElementsByClassName("switch");
let toggleFunction = (e) => {
    //search siblings for the checkbox input, toggle it upon click
    let toggleCheckbox = e.originalTarget.parentNode.firstElementChild;
    let event = new Event("change");
    toggleCheckbox.checked = !toggleCheckbox.checked;
    toggleCheckbox.dispatchEvent(event);
}

function onError(error) {
    console.log(`Error: ${error}`);
}


Array.from(toggleElements).forEach((e) => {
    e.addEventListener("click", toggleFunction);
});


//TODO: On initialization, check the state of all the toggle switches
//TODO: Save user's option settings from the popup
Array.from(switchElements).forEach((e) => {
    //Send message to content script to carry out the respective extension's functions depending on the option's toggle option

});

//Enable or disable focused youtube functionality
FOCUSED_YT_TOGGLE.addEventListener("change", () => {
    let querying = browser.tabs.query({
        url: "*://*.youtube.com/*"
    });

    if (FOCUSED_YT_TOGGLE.checked) {
        //enable the extension functionality
        querying.then((tabs) => {
            for (let tab of tabs) {
                browser.tabs.sendMessage(tab.id, {
                    command: "extension-enabled"
                })
            }
        }, onError)
    } else {
        //disable the extension functionality
        querying.then((tabs) => {
            for (let tab of tabs) {
                browser.tabs.sendMessage(tab.id, {
                    command: "extension-disabled"
                })
            }
        }, onError)
    }
});

function handleMessage(request, sender, sendResponse) {
    let markUp = request.InnerHTML;
    let keyIdentifier = "yt-focused-" + sender.tab.id;
    sessionStorage.setItem(keyIdentifier, markUp); //LEFT OFF HERE, find a way for the content script to access this data in the sessionStorage
    sendResponse({
        response: "Response from background script"
    });
}

browser.runtime.onMessage.addListener(handleMessage);
