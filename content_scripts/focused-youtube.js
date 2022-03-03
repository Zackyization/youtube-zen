///NOTE: For reference, 

(function () {
  function handleResponse(message) {
    // FOR DEBUGGING: console.log(`Message from the background script:  ${message.command}`);
    if (message.command === "extension-enabled") {
      removeYoutubeBrowsingArea();
    } else if (message.command === "extension-disabled") {
      resetYoutubeBrowsingArea();
    }
  }

  function handleError(error) {
    console.log(`Error: ${error}`);
  }

  function removeYoutubeBrowsingArea() {
    try {
      let browsingArea = document.getElementsByTagName("ytd-browse")[0];
      browsingArea.innerHTML = `<article id="yt-focused-area">
    <section class="content">  let mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
      console.log(mutation.target.tagName);
        if (mutation.target.tagName == "YTD-BROWSE") {
          mutation.target.body.style.backgroundColor = "red";
        }
      });
    });
  
    mutationObserver.observe(document.getElementById("page-manager"), {
      childList: true,
      characterData: true,
      subtree: true
    });
  
            <span>(▀̿Ĺ̯▀̿ ̿)</span>
            <h2 id="yt-focused-home-message">Focused Youtube enabled.</h2>
        </div>
    </section>
    </article>`;
      browsingArea.style.height = "calc(100vh - 56px)";
    } catch (err) {
      //To prevent browsingArea NULL error from appearing
      //Done so in event that user is not on the home page
      console.log("YTDBROWSE NOT IN");
    }
  }

  function resetYoutubeBrowsingArea() {
    try {
      let homeMessage = document.getElementById("yt-focused-home-message");
      homeMessage.innerHTML = "Disabled! Refresh to see changes take effect.";
    } catch (err) {
      //To prevent homeMessage NULL error from appearing
      //Done so in event that user is not on the home page
    }
  }

  /**
   * Check for user options and make the respective actions on the website
   */
  function checkUserOptions(e) {
    //send a message to background script, find out if there are any options toggled from the storage
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

  let mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
    console.log(mutation.target.tagName);
    //   if (mutation.target.tagName == "YTD-BROWSE") {
    //     mutation.target.body.style.backgroundColor = "red";
    //   }
    });
  });

  mutationObserver.observe(document.getElementById("page-manager"), {
    attributes: true,
    childList: true,
    characterData: true,
    subtree : true
  });

  window.addEventListener("load", checkUserOptions);
  
  /// LEFT OFF HERE, TODO: Figure out how to execute checkUserOptions() when everything on the web page has finished loading, try investigating the mutationObserver object

  console.log("FOR DEBUGGING: content script loaded!");
})();