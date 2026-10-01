/** Full intro length (ms) — keep in sync with the `intro-*` timings in globals.css. */
const PLAY_MS = 1650;
/** Skipped-intro exit length (ms) — matches the `html[data-intro="exit"]` rules in globals.css. */
const EXIT_MS = 350;

/**
 * Runs synchronously while the HTML is parsed: before first paint and before hydration.
 * Plays the intro only when a browser session starts on `/` with motion allowed; every hard load
 * marks the session as seen. It lives outside React so the overlay always cleans itself up,
 * even if hydration is slow or fails.
 */
export const introScript = `(function () {
  var root = document.documentElement;
  try {
    var seen = sessionStorage.getItem("ma-intro");
    sessionStorage.setItem("ma-intro", "1");
    if (seen || location.pathname !== "/") return;
  } catch (e) {
    return;
  }
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  root.dataset.intro = "play";
  var events = ["keydown", "pointerdown", "wheel", "touchstart"];
  var done = function () {
    delete root.dataset.intro;
    events.forEach(function (e) { removeEventListener(e, skip, true); });
  };
  var timer = setTimeout(done, ${PLAY_MS});
  var skip = function () {
    if (root.dataset.intro !== "play") return;
    root.dataset.intro = "exit";
    clearTimeout(timer);
    setTimeout(done, ${EXIT_MS});
  };
  events.forEach(function (e) { addEventListener(e, skip, { capture: true, passive: true }); });
})();`;
