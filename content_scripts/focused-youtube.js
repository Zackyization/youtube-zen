// const YOUTUBE_BROWSING_AREA = document.getElementsByTagName("ytd-page-manager")[0];
const YOUTUBE_BROWSING_AREA = document.getElementsByTagName("ytd-browse")[0];

(function () {
    function removeYoutubeBrowsingArea() {
        YOUTUBE_BROWSING_AREA.innerHTML = `<article id="yt-focused-area">
    <section class="content">
        <div>
            <span>(▀̿Ĺ̯▀̿ ̿)</span>
            <h2 id="yt-focused-home-message">Focused Youtube enabled.</h2>
        </div>
    </section>
</article>`;
    }

    function resetYoutubeBrowsingArea() {
        let homeMessage = document.getElementById("yt-focused-home-message");
        homeMessage.innerHTML = "Youtube Focused disabled, refresh to see changes take effect.";
    }

    /**
     * Listen for messages from the background script.
     */
    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "extension-enabled") {
            removeYoutubeBrowsingArea();
        } else if (message.command === "extension-disabled") {
            resetYoutubeBrowsingArea();
        }
    });
})();