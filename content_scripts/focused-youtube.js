const YOUTUBE_BROWSING_AREA = document.getElementsByTagName("ytd-browse")[0];
YOUTUBE_BROWSING_AREA.textContent = '';
YOUTUBE_BROWSING_AREA.innerHTML = `
<article id="focused-youtube-area">
    <section class="content">
        <div>
            <span>(▀̿Ĺ̯▀̿ ̿)</span>
            <h2>Focused Youtube enabled.</h2>
        </div>
    </section>
</article>`;