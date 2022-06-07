const YOUTUBE_PAGE_MANAGER = document.getElementById("page-manager");
const ACTIVATED_MESSAGE = `<article id="yt-focused-area">
<section class="content">
    <div>
        <span>(▀̿Ĺ̯▀̿ ̿)</span>
        <h2 id="yt-focused-home-message">Focused Youtube enabled.</h2>
    </div>
</section>
</article>`;
const ACTIVATED_MESSAGE_STYLE_HEIGHT = "calc(100vh - 56px)";

function handleResponse(message) {
  if (message.command === "extension-enabled") {
    removeYoutubeBrowsingArea();
  } else if (message.command === "extension-disabled") {
    resetYoutubeBrowsingArea();
  }
}

function handleError(error) {
  console.log(`Error: ${error}`);
}

/**
 * Visual changes are made on youtube page(s) to indicate that extension is enabled
 */
function removeYoutubeBrowsingArea() {
  if (window.location.pathname == '/') {
    let browsingArea = document.getElementsByTagName("ytd-browse")[0];
    try {
      browsingArea.innerHTML = ACTIVATED_MESSAGE;
      browsingArea.style.height = ACTIVATED_MESSAGE_STYLE_HEIGHT;
    } catch (error) {
      //do nothing
    }

  } else if (window.location.pathname == '/watch') {
    // remove end of video recommendations (".ytp-endscreen-content")
    let ytEndScreen = document.getElementsByClassName("ytp-endscreen-content")[0];

    // remove recommended video section
    let recommendedVideos = document.getElementById("secondary-inner");

    //remove floating video suggestions
    let ytHoveringRecommended = document.getElementsByClassName("ytp-ce-element");
    Array.from(ytHoveringRecommended).forEach((recommendation) => {
      recommendation.remove();
    });

    //remove comments
    let comments = document.getElementById("comments");
    comments.remove();

    // remove distractions
    try {
      ytEndScreen.style.display = "none";
      recommendedVideos.style.display = "none";
    } catch (error) {
      //do nothing
    }
  }
}

/**
 * Visual changes are made on youtube page(s) to indicate that extension is disabled
 */
function resetYoutubeBrowsingArea() {
  let homeMessage = document.getElementById("yt-focused-home-message");
  try {
    homeMessage.innerHTML = "Disabled! Refresh to see changes take effect.";
  } catch (error) {
    //do nothing
  }
}

/**
 * Check for user options and make the respective actions on the website
 */
function checkUserOptions() {
  //send a message to background script, find out if there are any options toggled from the storage
  console.log("Checking user options...");
  let checkingUserOptions = browser.runtime.sendMessage({
    message: "CHECK_OPTIONS",
  });
  checkingUserOptions.then(handleResponse, handleError);
}

/**
 * Listen for messages from the background script.
 */
browser.runtime.onMessage.addListener((message) => {
  if (
    message.command === "extension-enabled"
  ) {
    removeYoutubeBrowsingArea();
  } else if (message.command === "extension-disabled") {
    resetYoutubeBrowsingArea();
  }
});


/*
BUG: There was an issue with the distraction removals not happening at the right time, 
the setTimeout guarantees that the removals will happen, a temporary solution for now.
*/
setTimeout(function () {
  checkUserOptions();
}, 1200);