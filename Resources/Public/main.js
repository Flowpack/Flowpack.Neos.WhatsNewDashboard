"use strict";
(() => {
  // main.ts
  document.addEventListener("DOMContentLoaded", () => {
    const whatsNewIFrame = document.querySelector("#whatsNewIFrame");
    if (!whatsNewIFrame) return;
    const setIFrameHeight = (iFrame) => {
      if (iFrame.contentWindow && iFrame.contentWindow.document) {
        iFrame.style.height = iFrame.contentWindow.document.body.scrollHeight + 38 + "px";
      }
      console.log(iFrame.style.height);
    };
    whatsNewIFrame.addEventListener("load", () => setIFrameHeight(whatsNewIFrame));
    window.addEventListener("resize", () => setIFrameHeight(whatsNewIFrame));
  });
})();
