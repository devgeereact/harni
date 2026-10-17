import { renderToStaticMarkup } from "react-dom/server";

/** Game document source is React/TypeScript; HTML is generated build output. */
export function gameDocument(): string {
  return "<!doctype html>" + renderToStaticMarkup(
    <html lang="en-GB">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>Pier Run | A sunny little break</title>
        <meta name="description" content="A little break when life gets busy. Run along a sunny seaside pier, jump the benches, duck the gulls and collect tiny books." />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="canonical" href="https://harni.uk/play/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Harni Muharami" />
        <meta property="og:title" content="Pier Run | A sunny little break" />
        <meta property="og:description" content="A little break when life gets busy. Run along a sunny pier and collect tiny books." />
        <meta property="og:url" content="https://harni.uk/play/" />
        <meta property="og:image" content="https://harni.uk/media/shore-1280.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="module" src="/src/app/main.tsx"></script>
      </head>
      <body className="unwind">
        <a className="skip-link" href="#play">Skip to game</a>
        <header className="unwind-head">
          <a className="brand" href="/" aria-label="Harni Muharami home"><span className="brand__mark" aria-hidden="true">HM</span><span className="brand__name">Harni Muharami</span></a>
          <a className="unwind-back" href="/books/">Back to books</a>
        </header>
        <main className="unwind-main" id="play">
          <div className="unwind-title"><h1>Pier Run<span className="unwind-title__dot">.</span></h1><p>Leave the rush behind. Find your seaside stride.</p></div>
          <div className="game" data-game="" tabIndex={0} role="group" aria-label="Pier Run game" aria-describedby="game-controls">
            <div className="game__stage" data-game-stage="">
              <canvas className="game__canvas" data-game-canvas="" width="960" height="400" role="img" aria-label="A sunny seaside running game. A cheerful hero in a yellow sun cap runs along a sunny pier, double-jumping, bouncing on beach balls and collecting books."></canvas>
            </div>
            <div className="game__hud" aria-hidden="true">
              <div className="hud__row">
                <span className="hud__pill hud__hearts" data-hud-hearts=""></span>
                <span className="hud__pill"><span className="hud__label">Score</span><b data-hud-score="">0</b></span>
                <span className="hud__pill hud__pill--soft"><span className="hud__label">Books</span><b data-hud-books="">0</b></span>
                <span className="hud__pill hud__pill--soft hud__best"><span className="hud__label">Best</span><b data-hud-best="">0</b></span>
              </div>
              <div className="hud__row hud__row--chips">
                <span className="hud__chip hud__chip--combo" data-hud-combo="" hidden></span>
                <span className="hud__chip" data-hud-power="" hidden></span>
              </div>
            </div>
            <div className="game__overlay" data-game-overlay="">
              <div className="game__card">
                <p className="game__ticket-label">Harni’s seaside escape</p>
                <h2 className="game__card-title" data-game-title="">Small hero. Big sea air.</h2>
                <p className="game__card-text" data-game-text="">Jump twice. Bounce on beach balls. Collect books.</p>
                <dl className="game__result" data-game-result="" hidden>
                  <div><dt>Score</dt><dd data-result-score="">0</dd></div>
                  <div><dt>Books</dt><dd data-result-books="">0</dd></div>
                  <div><dt>Best</dt><dd data-result-best="">0</dd></div>
                </dl>
                <div className="game__card-actions">
                  <button className="btn" type="button" data-game-action="">Start run</button>
                  <a className="btn btn--outline" href="/books/" data-game-books="" hidden>See the books</a>
                </div>
              </div>
            </div>
            <ol className="game__journey" aria-label="Seaside route">
              <li data-route-stop="0" aria-current="location">Beach</li><li data-route-stop="1">Pier</li><li data-route-stop="2">Promenade</li><li data-route-stop="3">Funfair</li>
            </ol>
            <p className="visually-hidden" role="status" data-game-live=""></p>
          </div>
          <div className="unwind-controls">
            <p id="game-controls"><span className="game__hint-keys"><kbd>Space</kbd> or <kbd>↑</kbd> jump · again to double-jump <span aria-hidden="true">·</span> <kbd>↓</kbd> duck <span aria-hidden="true">·</span> <kbd>P</kbd> pause</span><span className="game__hint-touch">Tap to jump · again to double-jump, swipe down to duck.</span></p>
            <div className="unwind-controls__buttons">
              <button className="btn btn--outline" type="button" data-pause-game="" disabled>Pause</button>
              <button className="btn btn--outline" type="button" data-sound-toggle="">Sound: off</button>
            </div>
          </div>
          <details className="unwind-settings">
            <summary>Score settings</summary>
            <div className="unwind-settings__body">
              <label><input type="checkbox" data-save-score="" /> Remember my best score on this device</label>
              <button className="linklike" type="button" data-delete-score="">Delete saved score</button>
              <p data-storage-status="" role="status">Saving is off. Your score stays in this visit.</p>
              <a href="/cookies/">About saved scores</a>
            </div>
          </details>
          <noscript><p>Enable JavaScript to play, or <a href="/books/">explore the books</a>.</p></noscript>
        </main>
        <footer className="unwind-foot"><span>Take your time. Make it your moment.</span><nav aria-label="Footer"><a href="/privacy/">Privacy</a><a href="/cookies/">Cookies</a><a href="/terms/">Terms</a><a href="https://www.amazon.co.uk/stores/author/B0G27S5PSV" target="_blank" rel="noopener noreferrer">Amazon<span className="visually-hidden"> (opens in a new tab)</span></a></nav></footer>
      </body>
    </html>
  );
}
