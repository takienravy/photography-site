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
  function renderIndexGrid() {
    if (indexGrid.childElementCount > 0) return; // build once
    PHOTOS.forEach(function (photo, i) {
      var img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt || "";
      img.loading = "lazy";
      img.addEventListener("click", function () {
        openLightbox(i);
      });
      indexGrid.appendChild(img);
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
  render();
})();
