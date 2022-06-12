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
  switch (message.command) {
    case "check-successful":
      console.log("Check options successful!");
      break;
  }
}

function handleError(error) {
  console.log(`Error: ${error}`);
}

/**
 * Remove home page distractions
 */
function removeHomePageDistractions() {
  let browsingArea = document.getElementsByTagName("ytd-browse")[0];
  try {
    browsingArea.innerHTML = ACTIVATED_MESSAGE;
    browsingArea.style.height = ACTIVATED_MESSAGE_STYLE_HEIGHT;
  } catch (error) {
    //do nothing
  }
}

/**
 * Remove comments on video pages
 */
function removeVideoComments() {
  let comments = document.getElementById("comments");
  comments.remove();
}

/**
 * Remove in video recommendations/suggestions
 */
function removeVideoAnnotationSuggestions() {
  //get endscreen video recommendations
  let ytEndScreen = document.getElementsByClassName("ytp-endscreen-content")[0];

  //get floating video suggestions
  let ytHoveringRecommended = document.getElementsByClassName("ytp-ce-element");
  try {
    Array.from(ytHoveringRecommended).forEach((recommendation) => {
      recommendation.remove();
    });
    ytEndScreen.remove();
  } catch (error) {
    //do nothing
  }
}

/**
 * Remove suggested videos on the side from the watch page
 */
function removeSuggestedVideos() {
  //NOTE: Similar to the problem described at the bottom of this file, a delay is used to guarantee removal of the element.
  setTimeout(function () {
    let recommendedVideos = document.getElementById("secondary-inner");
    recommendedVideos.remove();
  }, 1000);
}

/**
 * Visual changes are made on youtube page(s) to indicate that extension is enabled
 */
function removeAllDistractions() {
  if (window.location.pathname == '/') {
    removeHomePageDistractions();
  } else if (window.location.pathname == '/watch') {
    removeVideoAnnotationSuggestions();
    removeVideoComments();
    removeSuggestedVideos();
  }
}

/**
 * Remove/reset specific distractions specified by the parameter
 */
function removeDistraction(option) {
  switch (option) {
    case "home":
      removeHomePageDistractions();
      break;

    case "comments":
      removeVideoComments();
      break;

    case "suggestions":
      removeSuggestedVideos();
      break;
  }
}

/*****
 * NOTE: Distractions are not reset individually as the user has to refresh to see the changes take place
 */

/**
 * Visual changes are made on youtube page(s) to indicate that extension is disabled
 */
function resetHomeDistractions() {
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
 * Listens for enable/disable messages from the background script.
 */
browser.runtime.onMessage.addListener((message) => {
  switch (message.command) {
    case "focused-enabled":
      removeAllDistractions();
      break;

    case "focused-disabled":
    case "home-disabled":
      resetHomeDistractions();
      break;

    case "home-enabled":
      removeDistraction("home");
      break;

    case "comments-enabled":
      removeDistraction("comments");
      break;
    
    case "suggestions-enabled":
      removeDistraction("suggestions");
      break;
  }
});


/*
BUG: There was an issue with the distraction removals not happening at the right time, 
the setTimeout guarantees that the removals will happen, a temporary solution for now.
*/
setTimeout(function () {
  checkUserOptions();
}, 1200);