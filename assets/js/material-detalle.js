/**
 * material-detalle.js
 * Lógica específica de material-detalle.html: lee el parámetro ?id= de la URL,
 * busca la entrada correspondiente en data/material.json y arma la vista de
 * detalle, mostrando solo los botones de los formatos que realmente existen.
 */
(function () {
  "use strict";

  var PREVIEWABLE_KEYS = ["pdf", "listado", "ppt", "pauta"];

  var FORMAT_ACTIONS = {
    pdf: [{ label: "Ver PDF", primary: true }, { label: "Descargar PDF", primary: false }],
    ppt: [{ label: "Ver presentación", primary: true }, { label: "Descargar presentación", primary: false }],
    pauta: [{ label: "Ver pauta", primary: true }, { label: "Descargar pauta", primary: false }],
    listado: [{ label: "Ver listado", primary: true }, { label: "Descargar listado", primary: false }],
    latex: [{ label: "Descargar LaTeX", primary: false }],
    source: [{ label: "Descargar archivos fuente", primary: false }],
    pptx: [{ label: "Descargar presentación", primary: false }],
    docx: [{ label: "Descargar documento", primary: false }],
    xlsx: [{ label: "Descargar planilla", primary: false }],
    csv: [{ label: "Descargar CSV", primary: false }],
    png: [{ label: "Ver imagen", primary: false }],
    jpg: [{ label: "Ver imagen", primary: false }]
  };

  function getRequestedId() {
    var params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  function fileButtonsHTML(item) {
    var files = item.files || {};
    var buttons = [];

    Object.keys(FORMAT_ACTIONS).forEach(function (key) {
      if (!files[key]) return;
      var isPreviewable = PREVIEWABLE_KEYS.indexOf(key) !== -1;
      FORMAT_ACTIONS[key].forEach(function (action, index) {
        var isViewAction = isPreviewable && index === 0;
        var classes = "btn " + (action.primary ? "btn-primary" : "btn-secondary");
        var target = isViewAction ? "" : ' download';
        var dataAttr = isViewAction ? ' data-preview-key="' + key + '"' : "";
        buttons.push(
          '<a class="' + classes + '"' + dataAttr + ' href="' + AyudantiaData.escapeHTML(files[key]) + '"' + target + ">" +
          AyudantiaData.escapeHTML(action.label) +
          "</a>"
        );
      });
    });

    return buttons.join("");
  }

  function previewHTML(item) {
    var files = item.files || {};
    var firstKey = PREVIEWABLE_KEYS.filter(function (k) { return files[k]; })[0];
    if (!firstKey) return "";

    return (
      '<div class="detail-preview">' +
      "<h2>Previsualización</h2>" +
      '<embed id="preview-embed" src="' + AyudantiaData.escapeHTML(files[firstKey]) + '" type="application/pdf" title="Previsualización de ' +
      AyudantiaData.escapeHTML(item.title) + '">' +
      "</div>"
    );
  }

  function topicsHTML(item) {
    var topics = item.topics || [];
    if (!topics.length) return "";
    return (
      '<ul class="detail-topics" aria-label="Temas">' +
      topics.map(function (topic) {
        return '<li class="topic-chip">' + AyudantiaData.escapeHTML(topic) + "</li>";
      }).join("") +
      "</ul>"
    );
  }

  function renderDetail(item) {
    document.title = item.title + " | Material de Ayudantía";

    var container = document.querySelector("[data-material-detail]");
    var colorVar = "var(--" + AyudantiaData.categoryColorVar(item.category) + ")";

    container.innerHTML =
      '<div class="detail-header">' +
      '<span class="category-badge" style="--cat-color: ' + colorVar + '">' +
      AyudantiaData.escapeHTML(item.category) +
      "</span>" +
      "<h1>" + AyudantiaData.escapeHTML(item.title) + "</h1>" +
      "<dl class=\"detail-meta\">" +
      "<div><dt>Fecha:</dt> <dd>" + AyudantiaData.escapeHTML(AyudantiaData.formatDate(item.date)) + "</dd></div>" +
      "<div><dt>Autores:</dt> <dd>" + AyudantiaData.escapeHTML((item.authors || []).join(", ")) + "</dd></div>" +
      "</dl>" +
      topicsHTML(item) +
      "<p>" + AyudantiaData.escapeHTML(item.description) + "</p>" +
      "</div>" +
      '<div class="detail-files">' + fileButtonsHTML(item) + "</div>" +
      previewHTML(item);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var container = document.querySelector("[data-material-detail]");
    if (!container) return;


    var requestedId = getRequestedId();
    if (!requestedId) {
      AyudantiaData.renderStateMessage(
        container,
        "Material no especificado",
        "Vuelve a la biblioteca y elige un material para ver su detalle.",
        true
      );
      return;
    }

    AyudantiaData.loadMaterial()
      .then(function (items) {
        var item = items.find(function (candidate) { return candidate.id === requestedId; });
        if (!item) {
          AyudantiaData.renderStateMessage(
            container,
            "No encontramos ese material",
            "Puede que el enlace esté desactualizado. Vuelve a la biblioteca para buscarlo de nuevo.",
            true
          );
          return;
        }
        renderDetail(item);
      })
      .catch(function (error) {
        console.error(error);
        AyudantiaData.renderStateMessage(
          container,
          "No se pudo cargar el material",
          "Revisa que data/material.json exista y tenga un formato válido.",
          true
        );
      });
  });
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest && e.target.closest("[data-preview-key]");
    if (!trigger) return;
    e.preventDefault();
    var embed = document.getElementById("preview-embed");
    if (embed) embed.src = trigger.getAttribute("href");
    document.querySelectorAll("[data-preview-key]").forEach(function (el) {
      el.classList.remove("is-active");
    });
    trigger.classList.add("is-active");
  });
  
})();
