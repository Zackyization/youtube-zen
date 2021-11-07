let ytBrowse = document.getElementsByTagName("ytd-browse")[0];
ytBrowse.textContent = ''; //wipes the browse section on the home page

ytBrowse.innerHTML = `<div id="youtube-productivity-tool-area">
    <h1>Productivity Mode enabled.</h1>
</div>`;

/*
TODO: Extension logo, make in inkscape.
TODO: Web extension popup menu that lets users toggle between productivity mode on/off. Ref: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Popups
TODO: Remove the recommended videos section on a video page. (The page where you actually watch a video)
TODO: Consider renaming the extension to "YouTube Focused"
NOTE: https://addons.mozilla.org/en-US/firefox/addon/df-youtube/, research the existing solutions,
see what you can do to improve on it
NOTE: https://github.com/mdn/webextensions-examples for all your referential needs
*/