import { STYLE_ID } from "./helper";

export const insertCSS = (doc: Document, styleText: string) => {
  let el = doc.getElementById(STYLE_ID);
  if (!el) {
    el = doc.createElement("style");
    el.setAttribute("type", "text/css");
    el.setAttribute("id", STYLE_ID);
    doc.head.appendChild(el);
  }

  el.textContent = styleText;
};

export const addClassName = (dom: HTMLElement, clz: string) => {
  if (!dom) return;
  const { classList } = dom;
  if (!classList.contains(clz)) {
    classList.add(clz);
  }
};

export const removeClassName = (dom: HTMLElement, clz: string) => {
  if (!dom) return;
  const { classList } = dom;
  if (classList.contains(clz)) {
    classList.remove(clz);
  }
};

export const getCurrentPageId = (doc: Document) => {
  const nodeIdEl = doc?.querySelector(
    "#layouts div.layout__center div.layout-tab-container div.protyle-content > div.protyle-background"
  );

  if (!nodeIdEl) return "";

  return nodeIdEl.getAttribute("data-node-id") || "";
};
