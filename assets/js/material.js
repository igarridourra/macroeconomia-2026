/**
 * material.js
 * Lógica específica de material.html: buscador, filtros por categoría y
 * ordenamiento de toda la biblioteca. Todo se resuelve en el cliente,
 * filtrando el arreglo cargado desde data/material.json.
 */
(function () {
  "use strict";

  var CATEGORIES = [
    "Todos",
    "Ayudantías",
    "Apuntes",
    "Ejercicios",
    "Controles",
    "Certámenes",
    "Presentaciones",
    "Complementario"
  ];

  var state = {
    items: [],
    query: "",
    category: "Todos",
    sort: "recientes"
  };

  var grid, searchInput, filterList, sortSelect, resultsCount;

  function normalize(text) {
    return (text || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function matchesQuery(item, query) {
    if (!query) return true;
    var haystack = [item.title, item.description, item.category]
      .concat(item.topics || [])
      .concat(item.authors || [])
      .map(normalize)
      .join(" | ");
    return haystack.indexOf(normalize(query)) !== -1;
  }

  function applyFiltersAndSort() {
    var filtered = state.items.filter(function (item) {
      var matchesCategory = state.category === "Todos" || item.category === state.category;
      return matchesCategory && matchesQuery(item, state.query);
    });

    switch (state.sort) {
      case "antiguos":
        filtered.sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
        break;
      case "az":
        filtered.sort(function (a, b) { return a.title.localeCompare(b.title, "es"); });
        break;
      case "za":
        filtered.sort(function (a, b) { return b.title.localeCompare(a.title, "es"); });
        break;
      case "recientes":
      default:
        filtered.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
        break;
    }

    render(filtered);
  }

  function render(items) {
    resultsCount.textContent =
      items.length === 1 ? "1 resultado" : items.length + " resultados";

    if (!items.length) {
      AyudantiaData.renderStateMessage(
        grid,
        "No encontramos material",
        "Prueba con otra palabra clave o quita algunos filtros."
      );
      return;
    }

    grid.innerHTML = items.map(AyudantiaData.materialCardHTML).join("");
  }

  function buildFilterChips() {
    filterList.innerHTML = CATEGORIES.map(function (category) {
      var pressed = category === state.category ? "true" : "false";
      return (
        '<li><button type="button" class="filter-chip" data-category="' +
        AyudantiaData.escapeHTML(category) +
        '" aria-pressed="' + pressed + '">' +
        AyudantiaData.escapeHTML(category) +
        "</button></li>"
      );
    }).join("");

    filterList.querySelectorAll("[data-category]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.category = chip.getAttribute("data-category");
        filterList.querySelectorAll("[data-category]").forEach(function (other) {
          other.setAttribute("aria-pressed", String(other === chip));
        });
        applyFiltersAndSort();
      });
    });
  }

  function readQueryFromURL() {
    var params = new URLSearchParams(window.location.search);
    var categoryParam = params.get("categoria");
    if (categoryParam && CATEGORIES.indexOf(categoryParam) !== -1) {
      state.category = categoryParam;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    grid = document.querySelector("[data-material-grid]");
    searchInput = document.querySelector("[data-material-search]");
    filterList = document.querySelector("[data-material-filters]");
    sortSelect = document.querySelector("[data-material-sort]");
    resultsCount = document.querySelector("[data-results-count]");

    if (!grid) return;

    readQueryFromURL();
    buildFilterChips();

    searchInput.addEventListener("input", function () {
      state.query = searchInput.value;
      applyFiltersAndSort();
    });

    sortSelect.addEventListener("change", function () {
      state.sort = sortSelect.value;
      applyFiltersAndSort();
    });

    AyudantiaData.loadMaterial()
      .then(function (items) {
        state.items = items;
        applyFiltersAndSort();
      })
      .catch(function (error) {
        console.error(error);
        AyudantiaData.renderStateMessage(
          grid,
          "No se pudo cargar el material",
          "Revisa que data/material.json exista y tenga un formato válido.",
          true
        );
      });
  });
})();
