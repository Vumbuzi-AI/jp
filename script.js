// J.P. Muia Health System — shared site behavior (no framework, no build step)
(function () {
  "use strict";

  /* ---- Header: scroll shadow ---- */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 16);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Header: mobile menu toggle (hamburger <-> X) ---- */
  var menuBtn = document.querySelector("[data-menu-btn]");
  var mobileNav = document.querySelector("[data-mobile-nav]");
  if (menuBtn && mobileNav) {
    var bars = menuBtn.querySelectorAll("span");
    menuBtn.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("hidden") === false;
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
      if (bars[0]) bars[0].classList.toggle("rotate-45", open);
      if (bars[0]) bars[0].classList.toggle("translate-y-[7px]", open);
      if (bars[1]) bars[1].classList.toggle("opacity-0", open);
      if (bars[2]) bars[2].classList.toggle("-rotate-45", open);
      if (bars[2]) bars[2].classList.toggle("-translate-y-[7px]", open);
    });
  }

  /* ---- Header: About dropdown (desktop) ---- */
  document.querySelectorAll("[data-dropdown]").forEach(function (wrap) {
    var btn = wrap.querySelector("[data-dropdown-btn]");
    var panel = wrap.querySelector("[data-dropdown-panel]");
    if (!btn || !panel) return;
    var close = function () {
      panel.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
    };
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var willOpen = panel.classList.contains("hidden");
      document.querySelectorAll("[data-dropdown-panel]").forEach(function (p) {
        p.classList.add("hidden");
      });
      if (willOpen) {
        panel.classList.remove("hidden");
        btn.setAttribute("aria-expanded", "true");
      }
    });
    wrap.addEventListener("mouseenter", function () {
      panel.classList.remove("hidden");
      btn.setAttribute("aria-expanded", "true");
    });
    wrap.addEventListener("mouseleave", close);
  });
  document.addEventListener("click", function () {
    document.querySelectorAll("[data-dropdown-panel]").forEach(function (p) {
      p.classList.add("hidden");
    });
  });

  /* ---- Header: mobile accordion (About sub-menu) ---- */
  document.querySelectorAll("[data-accordion-btn]").forEach(function (btn) {
    var panel = btn.parentElement.querySelector("[data-accordion-panel]");
    if (!panel) return;
    btn.addEventListener("click", function () {
      var open = panel.classList.toggle("hidden") === false;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.classList.toggle("is-open", open);
    });
  });

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("revealed");
    });
  }

  /* ---- Animated stat counters ---- */
  var counters = document.querySelectorAll("[data-count-to]");
  if (counters.length && "IntersectionObserver" in window) {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var countIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          countIo.unobserve(entry.target);
          var el = entry.target;
          var to = parseInt(el.getAttribute("data-count-to"), 10) || 0;
          var suffix = el.getAttribute("data-count-suffix") || "";
          if (reduced) {
            el.textContent = to + suffix;
            return;
          }
          var duration = 1800;
          var start = null;
          var step = function (ts) {
            if (start === null) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * to) + suffix;
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) {
      countIo.observe(el);
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll("[data-faq-btn]").forEach(function (btn) {
    var panel = btn.parentElement.querySelector("[data-faq-panel]");
    var icon = btn.querySelector("[data-faq-icon]");
    var label = btn.querySelector("[data-faq-label]");
    if (!panel) return;
    btn.addEventListener("click", function () {
      var open = panel.classList.toggle("hidden") === false;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (icon) {
        icon.classList.toggle("rotate-45", open);
        icon.classList.toggle("bg-brand", open);
        icon.classList.toggle("border-brand", open);
        icon.classList.toggle("text-white", open);
        icon.classList.toggle("border-brand-mid", !open);
        icon.classList.toggle("text-ink-muted", !open);
      }
      if (label) label.classList.toggle("text-brand", open);
    });
  });

  /* ---- Video modal ---- */
  document.querySelectorAll("[data-video-btn]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var videoId = btn.getAttribute("data-video-btn");
      var modal = document.querySelector("[data-video-modal]");
      var frame = document.querySelector("[data-video-frame]");
      if (!modal || !frame) return;
      frame.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0";
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      var closeBtn = modal.querySelector("[data-video-close]");
      if (closeBtn) closeBtn.focus();
    });
  });
  document.querySelectorAll("[data-video-close]").forEach(function (btn) {
    btn.addEventListener("click", closeVideoModal);
  });
  document.querySelectorAll("[data-video-modal]").forEach(function (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeVideoModal();
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeVideoModal();
  });
  function closeVideoModal() {
    var modal = document.querySelector("[data-video-modal]");
    var frame = document.querySelector("[data-video-frame]");
    if (!modal || modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    frame.src = "";
    document.body.style.overflow = "";
  }

  /* ---- Back to top ---- */
  var backTop = document.querySelector("[data-back-top]");
  if (backTop) {
    var toggleBackTop = function () {
      backTop.classList.toggle("hidden", window.scrollY <= 500);
    };
    window.addEventListener("scroll", toggleBackTop, { passive: true });
    toggleBackTop();
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---- Forms: fake-submit (no backend in this static build) ---- */
  document.querySelectorAll("[data-fake-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var successId = form.getAttribute("data-fake-form");
      var success = successId ? document.getElementById(successId) : null;
      form.classList.add("hidden");
      if (success) {
        success.classList.remove("hidden");
        // Some success panels use flex layout classes alongside "hidden";
        // set display explicitly so it wins regardless of Tailwind's
        // generated utility order for the "display" property.
        if (success.classList.contains("flex-col")) {
          success.style.display = "flex";
        }
      }
    });
  });
})();
