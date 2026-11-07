// Counts visitors for the ClipPilot team: a random ID kept in this browser, the page, and the site that
// linked here. No cookies, names or IP addresses. Turned off by "Do Not Track" or Global Privacy Control,
// and on any browser that once opened the site with ?notrack=1.
(function () {
  try {
    var ls = window.localStorage, q = location.search;
    if (/[?&]notrack=1/.test(q)) ls.setItem('cp_notrack', '1');
    if (/[?&]notrack=0/.test(q)) ls.removeItem('cp_notrack');
    if (ls.getItem('cp_notrack') === '1' || navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;
    var id = ls.getItem('cp_vid');
    if (!id || !/^[A-Za-z0-9_-]{16,64}$/.test(id)) {
      var b = new Uint8Array(16); crypto.getRandomValues(b);
      id = Array.prototype.map.call(b, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
      ls.setItem('cp_vid', id);
    }
    var ref = '';
    try { var r = new URL(document.referrer); if (r.host !== location.host) ref = r.host; } catch (e) {}
    var m = /[?&]utm_source=([\w.-]{1,60})/.exec(q); if (m) ref = m[1];
    var body = JSON.stringify({ v: id, p: location.pathname, r: ref });
    var url = 'https://clippilot-api.clippilot-api.workers.dev/v1/site/visit';
    if (!(navigator.sendBeacon && navigator.sendBeacon(url, new Blob([body], { type: 'text/plain' }))))
      fetch(url, { method: 'POST', body: body, keepalive: true, mode: 'cors', headers: { 'Content-Type': 'text/plain' } }).catch(function () {});
  } catch (e) {}
})();
