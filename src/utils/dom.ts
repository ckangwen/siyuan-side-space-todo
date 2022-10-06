import { STYLE_ID, ACTIVE_CONTENT_SELECTOR } from "./helper";

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
  // fn__flex-1 protyle
  // fn__flex-1 protyle fn__none
  // parent.parent. !has('fn__none')
  const nodeIdEl = doc?.querySelector(
    `${ACTIVE_CONTENT_SELECTOR} >div.protyle-content > div.protyle-background`
  );

  if (!nodeIdEl) return "";

  return nodeIdEl.getAttribute("data-node-id") || "";
};
