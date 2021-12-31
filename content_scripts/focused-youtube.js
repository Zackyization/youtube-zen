const YOUTUBE_PAGE_MANAGER = document.getElementById("page-manager");

(function () {
  function handleResponse(message) {
    console.log(`Message from the background script:  ${message.command}`);
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
    let browsingArea = document.getElementsByTagName("ytd-browse")[0];
    browsingArea.innerHTML = `<article id="yt-focused-area">
  <section class="content">
      <div>
          <span>(▀̿Ĺ̯▀̿ ̿)</span>
          <h2 id="yt-focused-home-message">Focused Youtube enabled.</h2>
      </div>
  </section>
  </article>`;
    browsingArea.style.height = "calc(100vh - 56px)";
  }

  function resetYoutubeBrowsingArea() {
    let homeMessage = document.getElementById("yt-focused-home-message");
    homeMessage.innerHTML = "Disabled! Refresh to see changes take effect.";
  }

  /**
   * Check for user options and make the respective actions on the website
   */
  function checkUserOptions(e) {
    //send a messsage to background script, find out if there are any options toggled from the storage
    console.log("Check User Options function loaded!");
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

  window.addEventListener("load", checkUserOptions);
  // console.log("FOR DEBUGGING: content script loaded!");
})();