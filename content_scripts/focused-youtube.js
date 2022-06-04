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

let count = 0;
let mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {

    /// TODO: Fix the bug stated below, look into Mutation Observer crashing upon setting a variable
    // BUG: CURRENT: Fix bug where browser would slow down/crash the page upon triggering a mutation change on the web page
    //// HERE'S WHY THE PAGE CRASHES WHEN YOU TRY TO LOAD THE HOME PAGE
    //// The character changes from the ACTIVATED_MESSAGE is contributing to the observe option, therefore an infinite loop is created and a never ending of MutationObserver changes are made to the page over and over and hence, the page crash.
    if (mutation.target.tagName === "YTD-BROWSE") {
      //attempt 1: clear textContent
      mutation.target.innerHTML = ACTIVATED_MESSAGE;
      mutation.target.style.height = ACTIVATED_MESSAGE_STYLE_HEIGHT;

      /// LEFT OFF HERE:, figure out why childList MutationRecord type loops on itself when making dom changes
      /// NOTE: Possible solution? https://stackoverflow.com/questions/50916642/mutation-observer-production-infinite-loop
      console.log(mutation);
    } else if (mutation.target.id === "secondary-inner") {
      mutation.target.remove();
    }
  })
});

function handleResponse(message) {
  if (message.command === "extension-enabled") {
    // console.log(document.getElementsByTagName("ytd-browse")[0]);
    removeYoutubeBrowsingArea();

    /// TODO: Make the mutationObserver work with reference to the other github page, https://github.com/Shubham-Somani/Chrome-Extenstion-Youtube-Distraction-Free/blob/master/content.js

    // mutationObserver.observe(YOUTUBE_PAGE_MANAGER, {
    //   childList: true,
    //   subtree: true
    // });

    mutationObserver.observe(YOUTUBE_PAGE_MANAGER, {
      attributes: true,
    });


    if (window.location.pathname == "/") {
      // let browsingArea = document.getElementsByTagName("ytd-browse")[0];
      // try {
      // } catch (error) {
      //   //do nothing
      // }
    }

    if (window.location.pathname == "/watch") {
      document.getElementById("secondary-inner").remove();
    }
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
    //BUG: CURRENT: On extension enabled, when browsing from the home page to a video page, recommended video section does not get removed

    let recommendedVideos = document.getElementById("secondary-inner");
    try {
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
  mutationObserver.disconnect();
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
    message.command === "extension-enabled" ||
    message.command === "enable-user-options"
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