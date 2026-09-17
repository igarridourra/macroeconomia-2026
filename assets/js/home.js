/**
 * home.js
 * Lógica específica de index.html: carga data/material.json y muestra
 * las publicaciones más recientes en la sección "Material reciente".
 */
(function () {
  "use strict";

  var MAX_RECENT_ITEMS = 3;

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.querySelector("[data-recent-material]");
    if (!grid) return;

    AyudantiaData.loadMaterial()
      .then(function (items) {
        if (!items.length) {
          AyudantiaData.renderStateMessage(
            grid,
            "Todavía no hay material publicado",
            "Vuelve pronto: el material se agrega directamente en data/material.json."
          );
          return;
        }

        var recent = AyudantiaData.sortByDateDesc(items).slice(0, MAX_RECENT_ITEMS);
        grid.innerHTML = recent.map(AyudantiaData.materialCardHTML).join("");
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
