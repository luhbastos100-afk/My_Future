"use strict";

(() => {
  const storageKey = "myFutureCardTransition";
  const windowNamePrefix = "MY_FUTURE_CARD_TRANSITION_V1:";
  const destinations = new Set([
    "mercado-de-trabalho.html",
    "concurso-publico.html",
    "curso-tecnico.html",
    "curso-superior.html",
    "empreendedorismo.html"
  ]);

  const filename = (path) => path.split("/").filter(Boolean).pop() || "index.html";

  function saveDestination(target) {
    try {
      window.sessionStorage.setItem(storageKey, target);
    } catch (_) {
      // window.name is used below as a same-tab fallback, including file:// browsing.
    }
    try {
      window.name = `${windowNamePrefix}${encodeURIComponent(target)}\n${window.name || ""}`;
    } catch (_) {
      // Navigation remains a normal HTML link even if browser storage is unavailable.
    }
  }

  function consumeDestination() {
    let saved = null;
    try {
      saved = window.sessionStorage.getItem(storageKey);
      window.sessionStorage.removeItem(storageKey);
    } catch (_) {
      // Try the browsing-context fallback below.
    }

    let nameSaved = null;
    const nameMatch = window.name.match(/^MY_FUTURE_CARD_TRANSITION_V1:([^\n]*)\n([\s\S]*)$/);
    if (nameMatch) {
      try { nameSaved = decodeURIComponent(nameMatch[1]); } catch (_) { nameSaved = nameMatch[1]; }
      window.name = nameMatch[2];
    }

    const current = filename(window.location.pathname);
    return destinations.has(current) && (saved === current || nameSaved === current);
  }

  function showBriefLoader() {
    const overlay = document.createElement("div");
    overlay.className = "mf-page-loader";
    overlay.setAttribute("role", "status");
    overlay.setAttribute("aria-live", "polite");
    const butterfly = (variant) => `<svg class="mf-loader-butterfly mf-loader-butterfly--${variant}" viewBox="0 0 64 54" aria-hidden="true" focusable="false"><g class="mf-loader-wing--left"><path class="mf-wing--upper-left" d="M31 25C24 15 13 6 6 10 0 14 4 26 12 29c8 3 15 0 19-2z"/><path class="mf-wing--lower-left" d="M31 28c-8-1-17 2-18 9-1 7 8 10 14 5 3-3 4-8 5-13z"/></g><g class="mf-loader-wing--right"><path class="mf-wing--upper-right" d="M33 25c7-10 18-19 25-15 6 4 2 16-6 19-8 3-15 0-19-2z"/><path class="mf-wing--lower-right" d="M33 28c8-1 17 2 18 9 1 7-8 10-14 5-3-3-4-8-5-13z"/></g><path class="mf-loader-body" d="M32 19c-3 4-3 8 0 12 3 4 2 9 0 14"/><path class="mf-loader-antenna" d="M31 21c-2-6-5-8-8-9m10 9c2-6 5-8 8-9"/></svg>`;
    overlay.innerHTML = `<div class="mf-loader-badge"><span class="mf-loader-butterflies" aria-hidden="true">${butterfly("one")}${butterfly("two")}${butterfly("three")}</span><span class="mf-loader-label">Abrindo conteúdo…</span></div>`;
    document.body.append(overlay);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => overlay.remove(), reducedMotion ? 230 : 560);
  }

  if (consumeDestination()) showBriefLoader();

  // Mark links in the home-page cards without replacing native navigation.
  document.addEventListener("click", (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    const link = target?.closest(".card a[href], a.button-link[href]");
    if (!link || (link.target && link.target.toLowerCase() !== "_self")) return;

    let targetPage;
    try { targetPage = filename(new URL(link.getAttribute("href"), document.baseURI).pathname); } catch (_) { return; }
    if (destinations.has(targetPage)) saveDestination(targetPage);
  });
})();
