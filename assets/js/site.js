/* =========================================================
   ROBERTSONS TEAM — shared interactions
   ========================================================= */
(function () {
  "use strict";
  var doc = document.documentElement;
  var body = document.body;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Page enter / leave ---------- */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { doc.classList.add("is-ready"); });
  });
  var markLoaded = function () { body.classList.add("is-loaded"); };
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 700); })]).then(markLoaded);
  } else { setTimeout(markLoaded, 100); }

  window.addEventListener("pageshow", function (e) {
    body.classList.remove("is-leaving", "menu-open"); doc.classList.add("is-ready");
    if (e.persisted) markLoaded();
  });

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === "_blank" || a.hasAttribute("download")) return;
    var href = a.getAttribute("href");
    if (!href || href.charAt(0) === "#" || /^(mailto:|tel:|https?:)/i.test(href)) return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.hash) return;
    if (!/\.html$|\/$/.test(url.pathname) || /\.pdf$/i.test(url.pathname)) return;
    if (reduce) return;
    e.preventDefault();
    body.classList.add("is-leaving");
    setTimeout(function () { location.href = a.href; }, 480);
  });

  /* ---------- Header / progress ---------- */
  var header = $(".header");
  var progress = $(".progress");
  var lastY = window.scrollY;
  function onScroll() {
    var y = window.scrollY;
    if (header) {
      header.classList.toggle("is-solid", y > 24);
      if (!body.classList.contains("menu-open")) {
        header.classList.toggle("is-hidden", y > 420 && y > lastY + 2);
        if (y < lastY - 2) header.classList.remove("is-hidden");
      }
    }
    if (progress) {
      var h = doc.scrollHeight - window.innerHeight;
      progress.style.setProperty("--p", h > 0 ? (y / h).toFixed(4) : 0);
    }
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = $(".burger");
  if (burger) {
    burger.addEventListener("click", function () {
      var open = !body.classList.contains("menu-open");
      body.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", open);
      var menu = $(".mmenu");
      if (menu) menu.setAttribute("aria-hidden", !open);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && body.classList.contains("menu-open")) burger.click();
    });
  }

  /* ---------- Reveal ---------- */
  $$("svg.draw").forEach(function (svg) {
    $$("path,line,circle,rect,polyline,ellipse", svg).forEach(function (el) {
      try { el.style.setProperty("--len", Math.ceil(el.getTotalLength()) + 1); } catch (e) {}
    });
  });
  var revealEls = $$("[data-reveal],[data-wipe],svg.draw,[data-count]");
  if (!("IntersectionObserver" in window) || reduce) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); if (el.hasAttribute("data-count")) countUp(el, true); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        if (en.target.hasAttribute("data-count")) countUp(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Counters ---------- */
  function countUp(el, instant) {
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = (el.getAttribute("data-count").split(".")[1] || "").length;
    if (instant) { el.textContent = target.toFixed(dec); return; }
    var start = null, dur = 1800;
    function tick(t) {
      if (!start) start = t;
      var p = Math.min(1, (t - start) / dur);
      var e = 1 - Math.pow(1 - p, 4);
      el.textContent = (target * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Word rotator ---------- */
  $$(".rotator").forEach(function (r) {
    var items = $$("span", r);
    if (items.length < 2) return;
    var i = 0;
    items[0].classList.add("on");
    if (reduce) return;
    setInterval(function () {
      items[i].classList.remove("on"); items[i].classList.add("off");
      var prev = items[i];
      setTimeout(function () { prev.classList.remove("off"); }, 800);
      i = (i + 1) % items.length;
      items[i].classList.add("on");
    }, 2400);
  });

  /* ---------- Scroll-scrubbed text ---------- */
  var scrubs = $$(".scrub");
  scrubs.forEach(function (el) {
    var walk = function (node) {
      $$(":scope > *", node).forEach(walk);
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType !== 3 || !n.textContent.trim()) return;
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (part) {
          if (/^\s+$/.test(part) || !part) { frag.appendChild(document.createTextNode(part)); return; }
          var s = document.createElement("span"); s.className = "w"; s.textContent = part; frag.appendChild(s);
        });
        n.parentNode.replaceChild(frag, n);
      });
    };
    walk(el);
    el._words = $$(".w", el);
  });
  function scrubUpdate() {
    scrubs.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
      p = reduce ? 1 : Math.max(0, Math.min(1, p));
      var n = Math.round(p * el._words.length);
      el._words.forEach(function (w, i) { w.classList.toggle("lit", i < n); });
    });
  }

  /* ---------- Process line ---------- */
  var processes = $$(".process");
  function processUpdate() {
    processes.forEach(function (pr) {
      var r = pr.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * 0.75 - r.top) / (r.height + vh * 0.1);
      p = reduce ? 1 : Math.max(0, Math.min(1, p));
      pr.style.setProperty("--p", p.toFixed(3));
      var steps = $$(".step", pr);
      steps.forEach(function (s, i) { s.classList.toggle("on", p >= (i / steps.length) + 0.02); });
    });
  }

  var ticking = false;
  function onScrollFx() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { scrubUpdate(); processUpdate(); ticking = false; });
  }
  if (scrubs.length || processes.length) {
    window.addEventListener("scroll", onScrollFx, { passive: true });
    window.addEventListener("resize", onScrollFx);
    onScrollFx();
  }

  /* ---------- Spotlight cards ---------- */
  $$(".pillar").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", (e.clientX - r.left) + "px");
      c.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* ---------- Tabs ---------- */
  $$("[data-tabs]").forEach(function (wrap) {
    var tabs = $$("[role=tab]", wrap);
    function select(t, focus) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute("aria-selected", on);
        x.tabIndex = on ? 0 : -1;
        var p = document.getElementById(x.getAttribute("aria-controls"));
        if (p) {
          p.classList.toggle("on", on);
          p.hidden = false;
          if (on) $$("svg.draw", p).forEach(function (s) { s.classList.remove("is-in"); void s.offsetWidth; s.classList.add("is-in"); });
        }
      });
      if (focus) t.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var k = e.key, n = null;
        if (k === "ArrowDown" || k === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        if (k === "ArrowUp" || k === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  });

  /* ---------- Sticky story ---------- */
  var chapters = $$(".chapter");
  if (chapters.length && "IntersectionObserver" in window) {
    var frames = $$(".sv-frame");
    var cnt = $(".sv-count b");
    var bar = $(".sv-bar");
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var idx = chapters.indexOf(en.target);
        chapters.forEach(function (c, i) { c.classList.toggle("on", i === idx); });
        frames.forEach(function (f, i) {
          f.classList.toggle("on", i === idx);
          if (i === idx) $$("svg.draw", f).forEach(function (s) { s.classList.add("is-in"); });
        });
        if (cnt) cnt.textContent = String(idx + 1).padStart(2, "0");
        if (bar) bar.style.setProperty("--sp", (idx + 1) / chapters.length);
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    chapters.forEach(function (c) { cio.observe(c); });
  } else { chapters.forEach(function (c) { c.classList.add("on"); }); }

  /* ---------- Live open / on-call status (Odessa, TX = US Central) ---------- */
  function centralNow() {
    try {
      var parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
      var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
      var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { day: days[o.weekday], hour: (parseInt(o.hour, 10) % 24) + parseInt(o.minute, 10) / 60 };
    } catch (e) { var d = new Date(); return { day: d.getDay(), hour: d.getHours() }; }
  }
  var now = centralNow();
  var state, label;
  if (now.day >= 1 && now.day <= 5 && now.hour >= 7 && now.hour < 17) { state = "open"; label = "Office open now"; }
  else if (now.day >= 1 && now.day <= 6) { state = "oncall"; label = "On-call team available"; }
  else { state = "closed"; label = "Closed today · on-call resumes Mon"; }
  $$("[data-status]").forEach(function (el) {
    el.setAttribute("data-state", state);
    var t = $(".st-text", el);
    if (t) t.textContent = label;
  });
  $$("[data-today]").forEach(function (tr) {
    var d = tr.getAttribute("data-today").split(",").map(Number);
    if (d.indexOf(now.day) > -1) tr.classList.add("today");
  });

  /* ---------- Year ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Molecular network canvas ---------- */
  function Molecules(canvas) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, nodes = [], mouse = { x: -9999, y: -9999 }, running = false, raf;
    var density = parseFloat(canvas.getAttribute("data-density") || "1");
    function resize() {
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.min(140, (W * H) / 11000) * density);
      nodes = [];
      for (var i = 0; i < count; i++) {
        var big = Math.random() < 0.08;
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
          r: big ? 2.6 + Math.random() * 1.6 : 1 + Math.random() * 1.2,
          red: big && Math.random() < 0.45, big: big, ph: Math.random() * Math.PI * 2
        });
      }
      if (!running) draw(0);
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      var maxD = Math.min(150, Math.max(100, W / 10));
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        if (running) {
          a.x += a.vx; a.y += a.vy;
          var dx = a.x - mouse.x, dy = a.y - mouse.y, md = dx * dx + dy * dy;
          if (md < 22000) { a.x += dx * 0.004; a.y += dy * 0.004; }
          if (a.x < -20) a.x = W + 20; if (a.x > W + 20) a.x = -20;
          if (a.y < -20) a.y = H + 20; if (a.y > H + 20) a.y = -20;
        }
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j];
          var ddx = a.x - b.x, ddy = a.y - b.y, d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < maxD) {
            var al = (1 - d / maxD) * 0.28;
            ctx.strokeStyle = "rgba(125,146,232," + al + ")";
            ctx.lineWidth = (a.big || b.big) ? 1 : 0.6;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k];
        var pulse = n.big ? 1 + Math.sin(t / 900 + n.ph) * 0.25 : 1;
        if (n.big) {
          ctx.fillStyle = n.red ? "rgba(240,53,59,.16)" : "rgba(125,146,232,.14)";
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 4 * pulse, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = n.red ? "rgba(240,53,59,.95)" : (n.big ? "rgba(214,222,255,.95)" : "rgba(170,186,245,.7)");
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }
      if (running) raf = requestAnimationFrame(draw);
    }
    function start() { if (running || reduce) return; running = true; raf = requestAnimationFrame(draw); }
    function stop() { running = false; cancelAnimationFrame(raf); }
    var host = canvas.parentElement;
    host.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    host.addEventListener("pointerleave", function () { mouse.x = mouse.y = -9999; });
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(resize, 150); });
    resize();
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { en[0].isIntersecting ? start() : stop(); }).observe(canvas);
    } else start();
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
  }
  $$("canvas.molecules").forEach(function (c) { Molecules(c); });

  /* ---------- Density explorer (home) ---------- */
  var ex = $("#explorer");
  if (ex && window.RT_CATALOG) {
    var cats = window.RT_CATALOG;
    var svgWrap = $(".strip-wrap", ex);
    var tip = $(".tip", ex);
    var roName = $(".ro-name", ex), roVals = $(".ro-vals", ex);
    var active = "all";
    var chipsBox = $(".chips", ex);
    var allBtn = document.createElement("button");
    allBtn.className = "chip"; allBtn.type = "button"; allBtn.setAttribute("aria-pressed", "true"); allBtn.dataset.cat = "all";
    allBtn.innerHTML = 'All <span class="ct">' + cats.reduce(function (a, c) { return a + c.items.length; }, 0) + "</span>";
    chipsBox.appendChild(allBtn);
    cats.forEach(function (c) {
      var b = document.createElement("button");
      b.className = "chip"; b.type = "button"; b.setAttribute("aria-pressed", "false"); b.dataset.cat = c.id;
      b.innerHTML = c.name + ' <span class="ct">' + c.items.length + "</span>";
      chipsBox.appendChild(b);
    });
    chipsBox.addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      active = b.dataset.cat;
      $$(".chip", chipsBox).forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      paint();
    });

    function render() {
      var w = svgWrap.clientWidth;
      var small = w < 640;
      var left = small ? 0 : 150, right = 12, top = 30, rowH = small ? 42 : 34;
      var rows = cats.length;
      var h = top + rows * rowH + 40;
      var x0 = 0.6, x1 = 1.75;
      var sx = function (v) { return left + (v - x0) / (x1 - x0) * (w - left - right); };
      var s = '<svg class="strip" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="Specific gravity of every catalog product, grouped by category">';
      s += '<g class="grid">';
      for (var v = 0.6; v <= 1.751; v += 0.1) { var gx = sx(v); s += '<line x1="' + gx + '" x2="' + gx + '" y1="' + (top - 10) + '" y2="' + (top + rows * rowH) + '"/>'; }
      s += "</g>";
      s += '<g class="axis">';
      s += '<line x1="' + left + '" x2="' + (w - right) + '" y1="' + (top + rows * rowH + 4) + '" y2="' + (top + rows * rowH + 4) + '"/>';
      for (var v2 = 0.6; v2 <= 1.751; v2 += small ? 0.2 : 0.1) {
        s += '<text x="' + sx(v2) + '" y="' + (top + rows * rowH + 24) + '" text-anchor="middle">' + v2.toFixed(1) + "</text>";
      }
      cats.forEach(function (c, i) {
        var y = top + i * rowH + rowH / 2;
        if (!small) s += '<text x="0" y="' + (y + 4) + '" style="font-family:var(--f-sans);font-size:13px;fill:var(--ink-2)" data-row="' + c.id + '">' + c.name + "</text>";
        else s += '<text x="0" y="' + (y - 12) + '" style="font-size:10px" data-row="' + c.id + '">' + c.name.toUpperCase() + "</text>";
      });
      s += "</g>";
      var wx = sx(1.0);
      s += '<g class="ref"><line x1="' + wx + '" x2="' + wx + '" y1="' + (top - 18) + '" y2="' + (top + rows * rowH) + '"/><text x="' + (wx + 6) + '" y="' + (top - 8) + '">WATER = 1.000</text></g>';
      cats.forEach(function (c, i) {
        var y = top + i * rowH + rowH / 2 + (small ? 4 : 0);
        c.items.forEach(function (it, j) {
          if (it[2] == null) return;
          var jitter = ((j % 3) - 1) * (small ? 3 : 4);
          s += '<circle class="dot" tabindex="0" r="' + (small ? 5 : 6.5) + '" cx="' + sx(it[2]).toFixed(1) + '" cy="' + (y + jitter) + '" data-cat="' + c.id + '" data-i="' + j + '"><title>' + it[0] + "</title></circle>";
        });
      });
      s += "</svg>";
      svgWrap.innerHTML = s;
      svgWrap.appendChild(tip);
      paint();
    }
    function paint() {
      $$(".dot", svgWrap).forEach(function (d) {
        d.classList.toggle("dim", active !== "all" && d.dataset.cat !== active);
      });
    }
    function show(d) {
      var c = cats.filter(function (x) { return x.id === d.dataset.cat; })[0];
      var it = c.items[+d.dataset.i];
      $$(".dot.hot", svgWrap).forEach(function (x) { x.classList.remove("hot"); });
      d.classList.add("hot");
      tip.innerHTML = "<b>" + it[0] + "</b><span>SG " + it[2].toFixed(3) + " · " + it[1] + " lb/gal</span>";
      var wr = svgWrap.getBoundingClientRect(), dr = d.getBoundingClientRect();
      var x = dr.left - wr.left + dr.width / 2;
      x = Math.max(90, Math.min(wr.width - 90, x));
      tip.style.left = x + "px"; tip.style.top = (dr.top - wr.top) + "px";
      tip.classList.add("on");
      roName.textContent = it[0];
      roVals.textContent = c.name + " · SG " + it[2].toFixed(3) + " · " + it[1] + " lb/gal · " + (it[2] < 1 ? "lighter than water" : it[2] > 1 ? "heavier than water" : "equal to water");
    }
    svgWrap.addEventListener("pointerover", function (e) { if (e.target.classList && e.target.classList.contains("dot")) show(e.target); });
    svgWrap.addEventListener("focusin", function (e) { if (e.target.classList && e.target.classList.contains("dot")) show(e.target); });
    svgWrap.addEventListener("pointerleave", function () { tip.classList.remove("on"); });
    svgWrap.addEventListener("focusout", function () { tip.classList.remove("on"); });
    render();
    var rt2; window.addEventListener("resize", function () { clearTimeout(rt2); rt2 = setTimeout(render, 150); });
  }
})();
