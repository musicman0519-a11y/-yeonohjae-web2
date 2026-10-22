/* 연오재한의원 공통 스크립트
   - 스크롤 등장 애니메이션, 헤더 드롭다운/모바일 메뉴, FAQ, 의료진 팝업, 네이버 지도, GA4 */
(function () {
  "use strict";
  var cfg = window.SITE_CONFIG || {};

  /* ---------- Google Analytics ---------- */
  if (cfg.gaId) {
    var ga = document.createElement("script");
    ga.async = true;
    ga.src = "https://www.googletagmanager.com/gtag/js?id=" + cfg.gaId;
    document.head.appendChild(ga);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", cfg.gaId);
  }

  /* ---------- 스크롤 등장 애니메이션 ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var idx = 0;
        if (el.parentElement) {
          var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.hasAttribute("data-reveal"); });
          idx = sibs.indexOf(el);
        }
        el.style.transitionDelay = Math.min(Math.max(idx, 0), 8) * 90 + "ms";
        el.classList.add("is-in");
        io.unobserve(el);
      });
    }, { threshold: 0, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
    // 안전장치: 화면 안에 있는데도 표시되지 않은 요소는 3초 후 강제 표시
    setTimeout(function () {
      revealEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in");
      });
    }, 3000);
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- 헤더 드롭다운 (PC) ---------- */
  var header = document.getElementById("site-header");
  var dropdown = document.getElementById("nav-dropdown");
  if (header && dropdown) {
    var panels = dropdown.querySelectorAll("[data-nav-panel]");
    var chevrons = header.querySelectorAll("[data-nav-item] svg");
    var closeDropdown = function () {
      dropdown.classList.add("hidden");
      dropdown.classList.remove("is-open");
      panels.forEach(function (p) { p.classList.add("hidden"); });
      chevrons.forEach(function (c) { c.style.transform = ""; });
    };
    header.querySelectorAll("[data-nav-item]").forEach(function (item) {
      item.addEventListener("mouseenter", function () {
        var label = item.getAttribute("data-nav-item");
        if (!item.hasAttribute("data-has-sub")) { closeDropdown(); return; }
        panels.forEach(function (p) {
          p.classList.toggle("hidden", p.getAttribute("data-nav-panel") !== label);
        });
        chevrons.forEach(function (c) { c.style.transform = ""; });
        var chev = item.querySelector("svg");
        if (chev) chev.style.transform = "rotate(180deg)";
        dropdown.classList.remove("hidden");
        dropdown.classList.add("is-open");
      });
    });
    header.addEventListener("mouseleave", closeDropdown);
    dropdown.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeDropdown); });
  }

  /* ---------- 모바일 메뉴 ---------- */
  var menuBtn = document.getElementById("menu-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  var overlay = document.getElementById("mobile-overlay");
  if (menuBtn && mobileMenu) {
    var menuOpen = false;
    var setMenu = function (open) {
      menuOpen = open;
      mobileMenu.classList.toggle("hidden", !open);
      mobileMenu.classList.toggle("is-open", open);
      if (overlay) overlay.classList.toggle("hidden", !open);
      menuBtn.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
      document.body.classList.toggle("menu-open", open);
    };
    menuBtn.addEventListener("click", function () { setMenu(!menuOpen); });
    if (overlay) overlay.addEventListener("click", function () { setMenu(false); });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    mobileMenu.querySelectorAll("[data-submenu-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var panel = btn.parentElement.nextElementSibling;
        var willOpen = panel.classList.contains("hidden");
        mobileMenu.querySelectorAll("[data-submenu]").forEach(function (p) { p.classList.add("hidden"); });
        mobileMenu.querySelectorAll("[data-submenu-toggle]").forEach(function (b) {
          b.setAttribute("aria-expanded", "false");
          var s = b.querySelector("svg"); if (s) s.style.transform = "";
        });
        if (willOpen) {
          panel.classList.remove("hidden");
          btn.setAttribute("aria-expanded", "true");
          var svg = btn.querySelector("svg"); if (svg) svg.style.transform = "rotate(180deg)";
        }
      });
    });
    window.addEventListener("resize", function () { if (window.innerWidth >= 1024 && menuOpen) setMenu(false); });
  }

  /* ---------- FAQ 아코디언 (첫 항목 기본 펼침) ---------- */
  var faqItems = document.querySelectorAll("[data-faq-item]");
  if (faqItems.length) {
    var setFaq = function (item, open) {
      item.querySelector(".faq-answer").classList.toggle("hidden", !open);
      item.querySelector(".faq-icon-plus").classList.toggle("hidden", open);
      item.querySelector(".faq-icon-minus").classList.toggle("hidden", !open);
      item.querySelector("[data-faq-toggle]").setAttribute("aria-expanded", open ? "true" : "false");
    };
    faqItems.forEach(function (item, i) {
      setFaq(item, i === 0);
      item.querySelector("[data-faq-toggle]").addEventListener("click", function () {
        var isOpen = !item.querySelector(".faq-answer").classList.contains("hidden");
        faqItems.forEach(function (o) { setFaq(o, false); });
        if (!isOpen) setFaq(item, true);
      });
    });
  }

  /* ---------- 의료진 팝업 ---------- */
  var modals = document.querySelectorAll("[data-doctor-modal]");
  if (modals.length) {
    var closeModals = function () {
      modals.forEach(function (m) { m.classList.add("hidden"); });
      document.body.classList.remove("modal-open");
    };
    document.querySelectorAll("[data-doctor-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = btn.getAttribute("data-doctor-open");
        closeModals();
        var m = document.querySelector('[data-doctor-modal="' + idx + '"]');
        if (m) { m.classList.remove("hidden"); document.body.classList.add("modal-open"); }
      });
    });
    modals.forEach(function (m) {
      m.addEventListener("click", function (e) { if (e.target === m) closeModals(); });
      m.querySelectorAll("[data-modal-close]").forEach(function (b) { b.addEventListener("click", closeModals); });
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModals(); });
  }

  /* ---------- 홈 v3: 검사 7종 목록 (마우스 올림/클릭 -> 설명·사진 전환) ---------- */
  var examList = document.querySelector("[data-exam-list]");
  if (examList) {
    var examItems = examList.querySelectorAll("[data-exam]");
    var examImgs = document.querySelectorAll("[data-exam-img]");
    var activateExam = function (idx) {
      examItems.forEach(function (it) {
        var on = it.getAttribute("data-exam") === idx;
        it.classList.toggle("is-active", on); it.setAttribute("aria-expanded", on ? "true" : "false");
      });
      examImgs.forEach(function (im) { im.classList.toggle("is-active", im.getAttribute("data-exam-img") === idx); });
    };
    examItems.forEach(function (it) {
      var go = function () { activateExam(it.getAttribute("data-exam")); };
      it.addEventListener("mouseenter", go); it.addEventListener("focus", go); it.addEventListener("click", go);
    });
  }

  /* ---------- /faq 검색 + 주제 필터 ---------- */
  var faqSearch = document.querySelector("[data-faq-search]");
  if (faqSearch) {
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-faq-card]"));
    var sections = Array.prototype.slice.call(document.querySelectorAll("[data-faq-section]"));
    var chips = Array.prototype.slice.call(document.querySelectorAll("[data-faq-chip]"));
    var empty = document.querySelector("[data-faq-empty]");
    var countEl = document.querySelector("[data-faq-count]");
    var topic = "all";
    var norm = function (t) { return (t || "").toLowerCase().replace(/\s+/g, ""); };
    var apply = function () {
      var q = norm(faqSearch.value);
      var shown = 0;
      cards.forEach(function (c) {
        var ok = (topic === "all" || c.getAttribute("data-topic") === topic) && (!q || norm(c.textContent).indexOf(q) >= 0);
        c.classList.toggle("hidden", !ok); if (ok) shown++;
      });
      sections.forEach(function (sec) {
        var any = sec.querySelectorAll("[data-faq-card]:not(.hidden)").length > 0;
        sec.classList.toggle("hidden", !any);
      });
      if (empty) empty.classList.toggle("hidden", shown > 0);
      if (countEl) countEl.textContent = shown;
    };
    faqSearch.addEventListener("input", apply);
    chips.forEach(function (ch) {
      ch.addEventListener("click", function () {
        topic = ch.getAttribute("data-faq-chip");
        chips.forEach(function (o) {
          var on = o === ch;
          o.classList.toggle("is-active", on);
          o.classList.toggle("bg-[#181d27]", on); o.classList.toggle("text-white", on); o.classList.toggle("border-[#181d27]", on);
          o.classList.toggle("bg-white", !on); o.classList.toggle("text-[#181d27]", !on); o.classList.toggle("border-[#e9eaeb]", !on);
        });
        apply();
        if (topic !== "all") { var sec = document.getElementById(topic); if (sec) { var y = sec.getBoundingClientRect().top + window.scrollY - 130; window.scrollTo({ top: y, behavior: "smooth" }); } }
      });
    });
    // 해시로 진입하면 해당 주제 선택
    var h = (location.hash || "").replace("#", "");
    if (h) { var target = chips.filter(function (c) { return c.getAttribute("data-faq-chip") === h; })[0]; if (target) target.click(); }
  }

  /* ---------- 네이버 지도 (키가 있으면 지도 삽입, 없으면 주소 카드) ---------- */
  var mapEl = document.getElementById("site-map");
  if (mapEl) {
    var loading = document.getElementById("map-loading");
    var btnCls = "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition ";
    var linksHtml =
      '<a href="' + cfg.naverPlaceUrl + '" target="_blank" rel="noopener noreferrer" class="' + btnCls + 'bg-[#03c75a] text-white hover:bg-[#02b351]">네이버 지도에서 보기</a>' +
      '<a href="tel:' + (cfg.phone || "") + '" class="' + btnCls + 'border border-[#181d27]/20 bg-white text-[#181d27] hover:bg-[#fafafa]">' + (cfg.phone || "전화") + '</a>';
    var infoHtml =
      '<div class="text-center px-6">' +
      '<p class="text-lg font-semibold text-[#181d27]">연오재한의원</p>' +
      '<p class="mt-2 text-base text-[#535862]">' + (cfg.address || "") + '</p>' +
      (cfg.transit ? '<p class="mt-1 text-sm text-[#717680]">' + cfg.transit + '</p>' : "") +
      '<div class="mt-5 flex flex-wrap justify-center gap-3">' + linksHtml + '</div></div>';
    var showCard = function () { if (loading) { loading.innerHTML = infoHtml; loading.className = "absolute inset-0 flex items-center justify-center bg-[#faf7f2] z-10"; } };
    // 네이버 키가 없을 때: 구글 지도 iframe (키 불필요). 네이버 키를 넣으면 자동으로 네이버 지도로 바뀜.
    var showGoogle = function () {
      var q = encodeURIComponent((cfg.mapLat || 0) + "," + (cfg.mapLng || 0) + "(" + "연오재한의원" + ")");
      var f = document.createElement("iframe");
      f.src = "https://www.google.com/maps?q=" + q + "&z=" + (cfg.mapZoom || 16) + "&hl=ko&output=embed";
      f.title = "연오재한의원 위치 (구글 지도)";
      f.setAttribute("loading", "lazy");
      f.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
      f.setAttribute("allowfullscreen", "");
      f.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0";
      mapEl.appendChild(f);
      if (loading) loading.remove();
      addLinksBelow();
    };
    var addLinksBelow = function () {
      var wrap = mapEl.parentNode && mapEl.parentNode.parentNode;
      if (!wrap || wrap.querySelector("[data-map-links]")) return;
      var row = document.createElement("div");
      row.setAttribute("data-map-links", "");
      row.className = "flex flex-col items-center gap-2 px-4 py-4 text-center sm:flex-row sm:justify-between";
      row.innerHTML = '<p class="text-sm text-[#535862]">' + (cfg.address || "") + (cfg.transit ? ' · ' + cfg.transit : "") + '</p><div class="flex gap-3">' + linksHtml + '</div>';
      wrap.appendChild(row);
    };
    if (cfg.naverMapKeyId) {
      var sdk = document.createElement("script");
      sdk.src = "https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=" + cfg.naverMapKeyId;
      sdk.onload = function () {
        try {
          var pos = new naver.maps.LatLng(cfg.mapLat, cfg.mapLng);
          var map = new naver.maps.Map(mapEl, { center: pos, zoom: cfg.mapZoom || 16, scaleControl: false, mapDataControl: false, logoControlOptions: { position: naver.maps.Position.BOTTOM_LEFT } });
          var marker = new naver.maps.Marker({ position: pos, map: map, title: "연오재한의원" });
          var info = new naver.maps.InfoWindow({ content: '<div style="padding:8px 14px;font-size:14px;font-weight:600;color:#111827;white-space:nowrap">연오재한의원</div>', borderWidth: 1, borderColor: "#e5e7eb" });
          info.open(map, marker);
          naver.maps.Event.addListener(marker, "click", function () { if (info.getMap()) info.close(); else info.open(map, marker); });
          if (loading) loading.remove();
          addLinksBelow();
        } catch (e) { showCard(); }
      };
      sdk.onerror = showGoogle;
      window.navermap_authFailure = showGoogle;
      document.head.appendChild(sdk);
    } else if (cfg.mapFallback === "card") {
      showCard();
    } else {
      showGoogle();
    }
  }
})();
