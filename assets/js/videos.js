/**
 * videos.js
 * Lógica específica de videos.html: carga data/videos.json y arma tarjetas
 * con miniatura de YouTube, datos de la clase y un enlace/embed al video.
 * No se descarga ni almacena ningún video: solo se enlaza a YouTube.
 */
(function () {
  "use strict";

  function extractYouTubeId(url) {
    if (!url) return null;
    var match = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/);
    return match ? match[1] : null;
  }

  function isPlaceholderId(id) {
    return !id || id === "VIDEO_ID" || /^VIDEO_ID/i.test(id);
  }

  function videoCardHTML(video) {
    var youtubeId = extractYouTubeId(video.youtube);
    var hasRealId = youtubeId && !isPlaceholderId(youtubeId);
    var thumbSrc = hasRealId
      ? "https://img.youtube.com/vi/" + youtubeId + "/hqdefault.jpg"
      : "";

    var thumbHTML = hasRealId
      ? '<img src="' + AyudantiaData.escapeHTML(thumbSrc) + '" alt="Miniatura de ' + AyudantiaData.escapeHTML(video.title) + '" loading="lazy">'
      : '<div class="state-message" style="border:none;padding:var(--space-4);">Miniatura no disponible</div>';

    return (
      '<article class="card video-card">' +
      '<div class="video-card__thumb">' + thumbHTML + "</div>" +
      '<div class="video-card__body">' +
      '<div class="video-card__meta">' + AyudantiaData.escapeHTML(video.topic) + " · " + AyudantiaData.escapeHTML(video.professor) + "</div>" +
      "<h3>" + AyudantiaData.escapeHTML(video.title) + "</h3>" +
      '<p class="video-card__desc">' + AyudantiaData.escapeHTML(video.description) + "</p>" +
      '<div class="video-card__actions">' +
      '<a class="btn btn-secondary btn-sm" href="' + AyudantiaData.escapeHTML(video.youtube) + '" target="_blank" rel="noopener">Ver en YouTube</a>' +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.querySelector("[data-videos-grid]");
    if (!grid) return;

    AyudantiaData.loadVideos()
      .then(function (videos) {
        if (!videos.length) {
          AyudantiaData.renderStateMessage(
            grid,
            "Todavía no hay videos publicados",
            "Agrega entradas en data/videos.json para que aparezcan aquí."
          );
          return;
        }
        grid.innerHTML = videos.map(videoCardHTML).join("");
      })
      .catch(function (error) {
        console.error(error);
        AyudantiaData.renderStateMessage(
          grid,
          "No se pudieron cargar los videos",
          "Revisa que data/videos.json exista y tenga un formato válido.",
          true
        );
      });
  });
})();
