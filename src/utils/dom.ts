export const WIDGET_CLASS_NAME = "siyuan-side-space-todo-view";
export const WIDGET_VISIBLE_CLASS_NAME = "is-visible";
export const SIDE_BALL_CLASS_NAME = "siyuan-side-space-todo-ball";

export const STYLE_ID = "siyuan-side-space-todo-style";

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
