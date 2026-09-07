(function () {
  "use strict";

  var viewHome = document.getElementById("view-home");
  var viewIndex = document.getElementById("view-index");
  var slideImage = document.getElementById("slide-image");
  var zonePrev = document.getElementById("zone-prev");
  var zoneNext = document.getElementById("zone-next");
  var indexGrid = document.getElementById("index-grid");

  var lightbox = document.getElementById("lightbox");
  var lightboxImage = document.getElementById("lightbox-image");
  var lightboxZonePrev = document.getElementById("lightbox-zone-prev");
  var lightboxZoneNext = document.getElementById("lightbox-zone-next");
  var lightboxClose = document.getElementById("lightbox-close");

  var contactOverlay = document.getElementById("contact-overlay");
  var contactOpenBtn = document.getElementById("contact-open");
  var contactCloseBtn = document.getElementById("contact-close");
  var contactBackdrop = document.getElementById("contact-backdrop");

  var homeIndex = 0;
  var lightboxIndex = 0;

  // ---------- Home slideshow ----------
  function renderHome() {
    var photo = PHOTOS[homeIndex];
    slideImage.src = photo.src;
    slideImage.alt = photo.alt || "";
  }

  function homeStep(delta) {
    homeIndex = (homeIndex + delta + PHOTOS.length) % PHOTOS.length;
    renderHome();
  }

  zonePrev.addEventListener("click", function () {
    homeStep(-1);
  });
  zoneNext.addEventListener("click", function () {
    homeStep(1);
  });

  // ---------- Index grid ----------
  // Real column <div>s, images distributed round-robin, instead of CSS
  // multi-column — avoids a cross-browser "column balancing" bug that
  // could add a phantom gap to the top of later columns.
  var MOBILE_BREAKPOINT = 860;
  var currentColumnCount = null;

  function columnCountForViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT ? 2 : 5;
  }

  function renderIndexGrid() {
    var columnCount = columnCountForViewport();
    if (columnCount === currentColumnCount) return; // already correct, skip rebuild
    currentColumnCount = columnCount;

    indexGrid.innerHTML = "";
    var columns = [];
    for (var c = 0; c < columnCount; c++) {
      var col = document.createElement("div");
      col.className = "index-column";
      indexGrid.appendChild(col);
      columns.push(col);
    }

    PHOTOS.forEach(function (photo, i) {
      var img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt || "";
      img.loading = "lazy";
      img.addEventListener("click", function () {
        openLightbox(i);
      });
      columns[i % columnCount].appendChild(img);
    });
  }

  // ---------- Lightbox ----------
  function renderLightbox() {
    var photo = PHOTOS[lightboxIndex];
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt || "";
  }

  function openLightbox(i) {
    lightboxIndex = i;
    renderLightbox();
    lightbox.hidden = false;
  }

  function closeLightbox() {
    lightbox.hidden = true;
  }

  function lightboxStep(delta) {
    lightboxIndex = (lightboxIndex + delta + PHOTOS.length) % PHOTOS.length;
    renderLightbox();
  }

  lightboxZonePrev.addEventListener("click", function () {
    lightboxStep(-1);
  });
  lightboxZoneNext.addEventListener("click", function () {
    lightboxStep(1);
  });
  lightboxClose.addEventListener("click", closeLightbox);

  // ---------- Contact overlay ----------
  function openContact() {
    contactOverlay.hidden = false;
  }
  function closeContact() {
    contactOverlay.hidden = true;
  }
  contactOpenBtn.addEventListener("click", openContact);
  contactCloseBtn.addEventListener("click", closeContact);
  contactBackdrop.addEventListener("click", closeContact);

  // ---------- Keyboard support ----------
  document.addEventListener("keydown", function (e) {
    if (!contactOverlay.hidden && e.key === "Escape") {
      closeContact();
      return;
    }
    if (!lightbox.hidden) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxStep(-1);
      if (e.key === "ArrowRight") lightboxStep(1);
      return;
    }
    if (!viewHome.hidden) {
      if (e.key === "ArrowLeft") homeStep(-1);
      if (e.key === "ArrowRight") homeStep(1);
    }
  });

  // ---------- Basic swipe support (mobile) ----------
  function addSwipe(el, onLeft, onRight) {
    var startX = null;
    el.addEventListener(
      "touchstart",
      function (e) {
        startX = e.touches[0].clientX;
      },
      { passive: true }
    );
    el.addEventListener(
      "touchend",
      function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) {
          if (dx < 0) onRight();
          else onLeft();
        }
        startX = null;
      },
      { passive: true }
    );
  }
  addSwipe(
    document.getElementById("slide-stage"),
    function () { homeStep(-1); },
    function () { homeStep(1); }
  );
  addSwipe(
    lightbox,
    function () { lightboxStep(-1); },
    function () { lightboxStep(1); }
  );

  // ---------- Routing ----------
  function render() {
    var hash = window.location.hash.replace(/^#/, "");
    if (hash === "/index") {
      viewHome.hidden = true;
      viewIndex.hidden = false;
      renderIndexGrid();
    } else {
      viewIndex.hidden = true;
      viewHome.hidden = false;
      renderHome();
    }
  }

  window.addEventListener("hashchange", render);
  window.addEventListener("resize", function () {
    // Only matters if the index grid is showing and the column count
    // needs to change (e.g. rotating a phone, or resizing a browser
    // window past the mobile breakpoint).
    if (!viewIndex.hidden) renderIndexGrid();
  });
  render();
})();
