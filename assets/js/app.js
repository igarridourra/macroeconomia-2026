/**
 * app.js
 * Comportamiento compartido por todas las páginas: tema claro/oscuro,
 * menú móvil, año del footer y resaltado del enlace de navegación activo.
 * No depende de ningún otro script del sitio.
 */
(function () {
  "use strict";

  var THEME_KEY = "ayudantia-theme";

  function getStoredTheme() {
    try {
      return window.localStorage.getItem(THEME_KEY);
    } catch (err) {
      return null;
    }
  }

  function storeTheme(value) {
    try {
      window.localStorage.setItem(THEME_KEY, value);
    } catch (err) {
      /* localStorage no disponible: la preferencia solo dura la sesión */
    }
  }

  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    updateToggleLabel(theme);
  }

  function currentEffectiveTheme() {
    var stored = getStoredTheme();
    if (stored === "light" || stored === "dark") return stored;
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  function updateToggleLabel(explicitTheme) {
    var toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) return;
    var effective = explicitTheme || currentEffectiveTheme();
    var isDark = effective === "dark";
    toggle.setAttribute("aria-pressed", String(isDark));
    var icon = toggle.querySelector("[data-theme-icon]");
    var label = toggle.querySelector("[data-theme-label]");
    if (icon) icon.textContent = isDark ? "🌙" : "☀️";
    if (label) label.textContent = isDark ? "Oscuro" : "Claro";
  }

  function initTheme() {
    var stored = getStoredTheme();
    applyTheme(stored);

    var toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var next = currentEffectiveTheme() === "dark" ? "light" : "dark";
        storeTheme(next);
        applyTheme(next);
      });
    }

    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
        if (!getStoredTheme()) updateToggleLabel();
      });
    }
  }

  function initMobileNav() {
    var navToggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-site-nav]");
    if (!navToggle || !nav) return;

    navToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function markActiveNavLink() {
    var currentPage = document.body.getAttribute("data-page");
    if (!currentPage) return;
    document.querySelectorAll("[data-site-nav] a[data-page-link]").forEach(function (link) {
      if (link.getAttribute("data-page-link") === currentPage) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function setFooterYear() {
    var el = document.querySelector("[data-current-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initMobileNav();
    markActiveNavLink();
    setFooterYear();
  });
})();
