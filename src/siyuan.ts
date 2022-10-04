import {
  WIDGET_CLASS_NAME,
  WIDGET_VISIBLE_CLASS_NAME,
  SIDE_BALL_CLASS_NAME,
  STYLE_ID,
  insertCSS,
  addClassName,
  removeClassName,
} from "./utils/dom";

const iframe = window.frameElement as HTMLIFrameElement | null;
const parentWindow = window.parent;
const parentDocument = window.parent?.document;
const parentIframeWrapper = window.frameElement?.parentElement;
const nodeWidget = parentIframeWrapper?.parentElement;

const allElEventListeners: [Element | Window, string, (e?: any) => void][] = [];

const clearAllListeners = () => {
  allElEventListeners.forEach(([el, event, listener]) => {
    if (el && event && listener) {
      el.removeEventListener(event, listener);
    }
  });
};

export const deleteWidget = () => {
  if (nodeWidget) {
    // 1. 删除挂件
    parentDocument
      ?.querySelectorAll(`.${WIDGET_CLASS_NAME}`)
      ?.forEach((dom) => {
        dom.parentElement?.removeChild(dom);
      });

    // 2. 删除悬浮球
    parentDocument
      ?.querySelectorAll(`.${SIDE_BALL_CLASS_NAME}`)
      ?.forEach((dom) => {
        dom.parentElement?.removeChild(dom);
      });

    // 3. 删除样式表
    parentDocument?.querySelectorAll(STYLE_ID)?.forEach((dom) => {
      dom.parentElement?.removeChild(dom);
    });

    // 4. 移除事件监听
    clearAllListeners();
  }
};

// eslint-disable-next-line max-statements
export const fixSiYuanStyle = () => {
  const dragNode = parentIframeWrapper?.querySelector(".protyle-action__drag");

  if (!iframe) return;

  iframe.style.height = "100%";
  iframe.style.width = "100%";

  // 隐藏缩放图标
  if (dragNode) {
    (dragNode as HTMLDivElement).style.display = "none";
    (dragNode as HTMLDivElement).style.opacity = "0";
  }

  // 删除拖拽位置图标
  if (nodeWidget) {
    addClassName(nodeWidget, WIDGET_CLASS_NAME);
    nodeWidget.removeAttribute("data-type");
  }

  const todoWidgetList = parentDocument.querySelectorAll(
    `.${WIDGET_CLASS_NAME}`
  );

  // 如果有多个挂件，则删除了第一个以外的所有
  if (todoWidgetList.length > 1) {
    todoWidgetList.forEach((dom, index) => {
      if (index !== 0) {
        dom.parentElement?.removeChild(dom);
      }
    });
  }

  insertCSS(
    parentDocument,
    `
    .${WIDGET_CLASS_NAME} > .iframe-content {
      height: 100%;
      width: 100%;
    }
    .b3-typography .iframe,
    .protyle-wysiwyg .iframe.${WIDGET_CLASS_NAME} {
      position: fixed;
      padding: 0;
      margin: 0;
    }
    .${WIDGET_CLASS_NAME} {
      position: fixed;
      left: 40px;
      top: 50%;
      transform: translateY(-50%);
      height: 70vh;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      background-color: rgba(255,255,255,.7);
      backdrop-filter: saturate(50%) blur(8px);
      transition: width 0.5s;
      width: 0;
      border-radius: 8px;
      z-index; 100;
    }
    .${WIDGET_CLASS_NAME}.${WIDGET_VISIBLE_CLASS_NAME} {
      width: 260px;
    }
    .${SIDE_BALL_CLASS_NAME} {
      width: 36px;
      height: 36px;
      position: fixed;
      left: 2px;
      top: 50%;
      transform: 50%;
      cursor: pointer;
      background: #000;
      border-radius: 50%;
      z-index: 100;
    }
  `
  );

  clearAllListeners();

  const ball = parentDocument.createElement("div");
  ball.setAttribute("class", SIDE_BALL_CLASS_NAME);

  const showContent = () => {
    if (nodeWidget) {
      addClassName(nodeWidget, WIDGET_VISIBLE_CLASS_NAME);
    }
  };
  const closeContent = (e: any) => {
    const { data } = e;
    if (data?.type === "event" && data?.name === "close") {
      if (nodeWidget) {
        removeClassName(nodeWidget, WIDGET_VISIBLE_CLASS_NAME);
      }
    }
  };

  ball.addEventListener("mouseenter", showContent);

  parentWindow.addEventListener("message", closeContent);

  allElEventListeners.push([ball, "mouseenter", showContent]);
  allElEventListeners.push([parentWindow, "mouseenter", closeContent]);

  parentDocument.body.appendChild(ball);
};
