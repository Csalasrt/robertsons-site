/* Products page: filter, search, sort, quote list, calculator
   + Contact page: quote-list prefill and form progress */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var cats = window.RT_CATALOG || [];
  var KEY = "rt-quote-list";

  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; } }
  function save(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var plus = '<svg viewBox="0 0 24 24" class="ico" style="stroke-width:2"><path d="M12 5v14M5 12h14"/></svg>';

  /* ================= PRODUCTS ================= */
  var tbody = $("#ptbody");
  if (tbody) {
    var quote = load();
    var rows = [];
    var maxLb = 14.1;
    cats.forEach(function (c) {
      c.items.forEach(function (it) {
        var tr = document.createElement("tr");
        var sg = it[2] == null ? '<span class="muted">—</span>' : it[2].toFixed(3);
        var lb = it[1] + (it[3] ? ' <small>' + it[3] + "</small>" : "");
        tr.innerHTML =
          '<td class="nm">' + esc(it[0]) + "</td>" +
          '<td class="ct">' + c.name + "</td>" +
          '<td class="num" data-l="lb/gal">' + lb + '<span class="bar" aria-hidden="true"><i style="--w:' + (it[1] / maxLb * 100).toFixed(1) + '%"></i></span></td>' +
          '<td class="num" data-l="SG">' + sg + "</td>" +
          '<td class="act"><button type="button" class="add" aria-pressed="false" aria-label="Add ' + esc(it[0]) + ' to quote list">' + plus + "<span>Quote</span></button></td>";
        tr._d = { name: it[0], cat: c.id, catName: c.name, lb: it[1], sg: it[2] == null ? -1 : it[2] };
        rows.push(tr);
        tbody.appendChild(tr);
      });
    });

    var state = { cat: "all", q: "", sort: null, dir: 1 };
    var countEl = $("#rcount"), empty = $("#empty");
    var catNav = $("#catnav");
    function apply() {
      var q = state.q.trim().toLowerCase();
      var shown = 0;
      rows.forEach(function (tr) {
        var d = tr._d;
        var ok = (state.cat === "all" || d.cat === state.cat) && (!q || d.name.toLowerCase().indexOf(q) > -1 || d.catName.toLowerCase().indexOf(q) > -1);
        tr.classList.toggle("hide", !ok);
        var nm = tr.firstChild;
        if (ok && q && d.name.toLowerCase().indexOf(q) > -1) {
          var i = d.name.toLowerCase().indexOf(q);
          nm.innerHTML = esc(d.name.slice(0, i)) + "<mark>" + esc(d.name.slice(i, i + q.length)) + "</mark>" + esc(d.name.slice(i + q.length));
        } else nm.textContent = d.name;
        if (ok) shown++;
      });
      countEl.textContent = shown + (shown === 1 ? " product" : " products");
      empty.classList.toggle("on", shown === 0);
    }
    function sortBy(key) {
      if (state.sort === key) state.dir *= -1; else { state.sort = key; state.dir = 1; }
      rows.sort(function (a, b) {
        var x = a._d[key], y = b._d[key];
        return (typeof x === "string" ? x.localeCompare(y) : x - y) * state.dir;
      });
      rows.forEach(function (r) { tbody.appendChild(r); });
      $$("th[data-sort]").forEach(function (th) {
        if (th.dataset.sort === key) th.setAttribute("aria-sort", state.dir === 1 ? "ascending" : "descending");
        else th.removeAttribute("aria-sort");
      });
    }
    $$("th[data-sort] button").forEach(function (b) { b.addEventListener("click", function () { sortBy(b.parentNode.dataset.sort); }); });

    // category nav
    var allN = rows.length;
    var mk = function (id, name, n) {
      var b = document.createElement("button");
      b.type = "button"; b.dataset.cat = id; b.setAttribute("aria-pressed", id === "all");
      b.innerHTML = name + " <span>" + n + "</span>";
      return b;
    };
    var navHead = $(".cn-h", catNav);
    var frag = document.createDocumentFragment();
    frag.appendChild(mk("all", "All products", allN));
    cats.forEach(function (c) { frag.appendChild(mk(c.id, c.name, c.items.length)); });
    navHead.after(frag);
    function setCat(id, scroll) {
      state.cat = id;
      $$("button[data-cat]", catNav).forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.cat === id); });
      apply();
      if (scroll) {
        var t = $("#catalog");
        if (t && t.getBoundingClientRect().top < 0) window.scrollTo({ top: window.scrollY + t.getBoundingClientRect().top - 100, behavior: "smooth" });
      }
    }
    catNav.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-cat]"); if (!b) return;
      setCat(b.dataset.cat, true);
      try { history.replaceState(null, "", b.dataset.cat === "all" ? location.pathname : "#" + b.dataset.cat); } catch (er) {}
    });
    var hash = location.hash.slice(1);
    if (hash && cats.some(function (c) { return c.id === hash; })) setCat(hash);

    var search = $("#psearch");
    search.addEventListener("input", function () { state.q = search.value; apply(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") { e.preventDefault(); search.focus(); }
    });

    // quote list
    var tray = $("#tray"), tcount = $("#tcount"), tgo = $("#tgo");
    function syncQuote() {
      rows.forEach(function (tr) {
        var on = quote.indexOf(tr._d.name) > -1;
        var b = tr.querySelector(".add");
        b.setAttribute("aria-pressed", on);
        b.lastChild.textContent = on ? "Added" : "Quote";
      });
      tcount.textContent = quote.length;
      tray.classList.toggle("on", quote.length > 0);
      tgo.href = "contact.html?products=" + encodeURIComponent(quote.join("|"));
      save(quote);
    }
    tbody.addEventListener("click", function (e) {
      var b = e.target.closest(".add"); if (!b) return;
      var name = b.closest("tr")._d.name;
      var i = quote.indexOf(name);
      if (i > -1) quote.splice(i, 1); else quote.push(name);
      syncQuote();
    });
    $("#tclear").addEventListener("click", function () { quote = []; syncQuote(); });
    apply(); syncQuote();

    /* ---- calculator ---- */
    var sel = $("#cprod"), qty = $("#cqty"), unit = $("#cunit");
    cats.forEach(function (c) {
      var g = document.createElement("optgroup"); g.label = c.name;
      c.items.forEach(function (it) {
        var o = document.createElement("option"); o.value = it[1]; o.textContent = it[0]; g.appendChild(o);
      });
      sel.appendChild(g);
    });
    // default: Methanol
    $$("option", sel).some(function (o) { if (o.textContent === "Methanol") { o.selected = true; return true; } });
    var fmt = function (n, d) { return n.toLocaleString("en-US", { maximumFractionDigits: d || 0, minimumFractionDigits: d || 0 }); };
    var outLb = $("#oLb"), outGal = $("#oGal"), outKg = $("#oKg"), outL = $("#oL"), outT = $("#oT"), outName = $("#oName");
    var shown = 0, anim;
    function calc() {
      var lbg = parseFloat(sel.value) || 0;
      var q = Math.max(0, parseFloat(qty.value) || 0);
      var gal = q * parseFloat(unit.value);
      var lb = gal * lbg;
      outGal.textContent = fmt(gal);
      outKg.textContent = fmt(lb * 0.45359237);
      outL.textContent = fmt(gal * 3.785411784);
      outT.textContent = fmt(lb / 2000, 2);
      outName.textContent = sel.options[sel.selectedIndex].textContent + " · " + lbg + " lb/gal";
      var from = shown, to = lb, st = null;
      cancelAnimationFrame(anim);
      (function step(t) {
        if (!st) st = t;
        var p = Math.min(1, (t - st) / 600), e = 1 - Math.pow(1 - p, 3);
        shown = from + (to - from) * e;
        outLb.firstChild.textContent = fmt(shown);
        if (p < 1) anim = requestAnimationFrame(step);
      })(performance.now());
    }
    [sel, qty, unit].forEach(function (el) { el.addEventListener("input", calc); el.addEventListener("change", calc); });
    calc();
  }

  /* ================= CONTACT ================= */
  var form = $("#quoteForm");
  if (form) {
    var picked = $("#picked"), hidden = $("#productsField");
    var list = [];
    try {
      var p = new URLSearchParams(location.search).get("products");
      if (p) list = p.split("|").filter(Boolean);
    } catch (e) {}
    if (!list.length) list = load();
    function draw() {
      picked.innerHTML = list.map(function (n, i) {
        return '<span class="pk">' + esc(n) + '<button type="button" data-i="' + i + '" aria-label="Remove ' + esc(n) + '"><svg viewBox="0 0 24 24" width="12" height="12" class="ico" style="stroke-width:2.2"><path d="M6 6l12 12M18 6L6 18"/></svg></button></span>';
      }).join("");
      hidden.value = list.join(", ");
      $("#pickedWrap").hidden = list.length === 0;
      save(list);
    }
    picked.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-i]"); if (!b) return;
      list.splice(+b.dataset.i, 1); draw();
    });
    draw();

    // progress meter
    var req = $$("[data-track]", form);
    var bars = $$(".form-steps i");
    function meter() {
      var filled = req.filter(function (f) {
        if (f.type === "checkbox" || f.type === "radio") return $$('input[name="' + f.name + '"]:checked', form).length > 0;
        return f.value.trim() !== "";
      }).length;
      var frac = filled / req.length;
      bars.forEach(function (b, i) {
        var seg = Math.max(0, Math.min(1, frac * bars.length - i));
        b.style.setProperty("--f", seg);
      });
    }
    form.addEventListener("input", meter); form.addEventListener("change", meter); meter();
  }
})();
