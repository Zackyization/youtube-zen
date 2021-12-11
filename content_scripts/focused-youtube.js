const YOUTUBE_BROWSING_AREA = document.getElementsByTagName("ytd-browse")[0];
const YOUTUBE_PAGE_MANAGER = document.getElementById("page-manager");

(function () {
    function handleResponse(message) {
        console.log(`Message from the background script:  ${message.response}`);
        if (message.response === "enable-user-options") {
            removeYoutubeBrowsingArea();
        }
    }

    function handleError(error) {
        console.log(`Error: ${error}`);
    }

    function removeYoutubeBrowsingArea() {
        YOUTUBE_BROWSING_AREA.innerHTML = `<article id="yt-focused-area">
    <section class="content">
        <div>
            <span>(▀̿Ĺ̯▀̿ ̿)</span>
            <h2 id="yt-focused-home-message">Focused Youtube enabled.</h2>
        </div>
    </section>
</article>`;
        YOUTUBE_PAGE_MANAGER.style.height = "calc(100vh - 56px)";
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
        let checkingUserOptions = browser.runtime.sendMessage({
            message: "CHECK_OPTIONS"
        });
        checkingUserOptions.then(handleResponse, handleError)
    }

    /**
     * Listen for messages from the background script.
     */
    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "extension-enabled" || message.command === "enable-user-options") {
            removeYoutubeBrowsingArea();
        } else if (message.command === "extension-disabled") {
            resetYoutubeBrowsingArea();
        }
    });

    //BUG: Fix bug where extension doesn't come into effect until popup is clicked
    document.addEventListener("DOMContentLoaded", checkUserOptions);
})();