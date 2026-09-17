/**
 * data.js
 * Utilidades compartidas para cargar data/material.json y data/videos.json,
 * y para construir el HTML de las tarjetas de material. Lo usan home.js,
 * material.js, material-detalle.js y videos.js.
 *
 * No hay backend: todo se resuelve en el navegador a partir de los JSON.
 */
var AyudantiaData = (function () {
  "use strict";

  var CATEGORY_CLASS = {
    "Ayudantías": "cat-ayudantias",
    "Apuntes": "cat-apuntes",
    "Ejercicios": "cat-ejercicios",
    "Controles": "cat-controles",
    "Certámenes": "cat-certamenes",
    "Presentaciones": "cat-presentaciones",
    "Complementario": "cat-complementario"
  };

  var FORMAT_LABELS = {
    pdf: "PDF",
    latex: "LaTeX",
    source: "ZIP",
    pptx: "PPTX",
    docx: "DOCX",
    xlsx: "XLSX",
    csv: "CSV",
    png: "PNG",
    jpg: "JPG"
  };

  function fetchJSON(path) {
    return fetch(path, { cache: "no-store" }).then(function (response) {
      if (!response.ok) {
        throw new Error("No se pudo cargar " + path + " (HTTP " + response.status + ")");
      }
      return response.json();
    });
  }

  function loadMaterial() {
    return fetchJSON("data/material.json");
  }

  function loadVideos() {
    return fetchJSON("data/videos.json");
  }

  function formatDate(isoDate) {
    if (!isoDate) return "";
    var parts = isoDate.split("-").map(Number);
    var date = new Date(parts[0], parts[1] - 1, parts[2]);
    if (isNaN(date.getTime())) return isoDate;
    return date.toLocaleDateString("es-CL", { day: "2-digit", month: "long", year: "numeric" });
  }

  /** Devuelve el nombre de la variable CSS (sin "--") que define el color de una categoría. */
  function categoryColorVar(category) {
    return CATEGORY_CLASS[category] || "cat-complementario";
  }

  function availableFormats(item) {
    var files = item.files || {};
    return Object.keys(files).filter(function (key) {
      return !!files[key];
    });
  }

  function formatLabel(key) {
    return FORMAT_LABELS[key] || key.toUpperCase();
  }

  function escapeHTML(value) {
    var div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  }

  /** Construye el HTML de una tarjeta de material (usado en inicio y biblioteca). */
  function materialCardHTML(item) {
    var formats = availableFormats(item)
      .map(function (key) {
        return '<span class="format-chip">' + escapeHTML(formatLabel(key)) + "</span>";
      })
      .join("");

    return (
      '<a class="card material-card" style="--cat-color: var(--' + categoryColorVar(item.category) + ')" ' +
      'href="material-detalle.html?id=' + encodeURIComponent(item.id) + '">' +
      '<div class="material-card__meta">' +
      '<span class="category-badge" style="--cat-color: var(--' + categoryColorVar(item.category) + ')">' + escapeHTML(item.category) + "</span>" +
      "<span>" + escapeHTML(formatDate(item.date)) + "</span>" +
      "</div>" +
      '<h3 class="material-card__title">' + escapeHTML(item.title) + "</h3>" +
      '<p class="material-card__desc">' + escapeHTML(item.description) + "</p>" +
      '<div class="material-card__formats">' + formats + "</div>" +
      "</a>"
    );
  }

  function sortByDateDesc(list) {
    return list.slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  }

  function renderStateMessage(container, title, description, isError) {
    container.innerHTML =
      '<div class="state-message' + (isError ? " state-message--error" : "") + '">' +
      "<h3>" + escapeHTML(title) + "</h3>" +
      "<p>" + escapeHTML(description) + "</p>" +
      "</div>";
  }

  return {
    loadMaterial: loadMaterial,
    loadVideos: loadVideos,
    formatDate: formatDate,
    categoryColorVar: categoryColorVar,
    availableFormats: availableFormats,
    formatLabel: formatLabel,
    escapeHTML: escapeHTML,
    materialCardHTML: materialCardHTML,
    sortByDateDesc: sortByDateDesc,
    renderStateMessage: renderStateMessage
  };
})();
