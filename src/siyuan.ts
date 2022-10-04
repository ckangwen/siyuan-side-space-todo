/* eslint-disable max-statements */
import { ref } from "vue";
import {
  getCurrentPageId,
  insertCSS,
  addClassName,
  removeClassName,
} from "./utils/dom";
import { fetchBlockKramdown, insertBlock } from "./utils/request";
import {
  getDefaultInsertContent,
  KRAMDOWN_ATTRIBUTE_RE,
  WIDGET_CLASS_NAME,
  WIDGET_VISIBLE_CLASS_NAME,
  SIDE_BALL_CLASS_NAME,
  STYLE_ID,
  BLOCK_TITLE,
  last,
  NODE_ID_RE,
} from "./utils/helper";

const iframe = window.frameElement as HTMLIFrameElement | null;
const parentWindow = window.parent;
const parentDocument = window.parent?.document;
const parentIframeWrapper = window.frameElement?.parentElement;
const nodeWidget = parentIframeWrapper?.parentElement;

const allElEventListeners: [Element | Window, string, (e?: any) => void][] = [];

export const todoViewVisible = ref(false);

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

export const fixSiYuanStyle = () => {
  const dragNode = parentIframeWrapper?.querySelector(".protyle-action__drag");

  if (!iframe) return;

  iframe.style.height = "100%";
  iframe.style.width = "100%";
  iframe.style.overflow = "hidden";

  // 隐藏缩放图标
  if (dragNode) {
    (dragNode as HTMLDivElement).style.display = "none";
    (dragNode as HTMLDivElement).style.opacity = "0";
  }

  // 删除拖拽位置图标
  if (nodeWidget) {
    addClassName(nodeWidget, WIDGET_CLASS_NAME);
    nodeWidget.removeAttribute("data-type");
    nodeWidget.style.overflow = "hidden";
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
      transition: width 0.5s, opacity 1s;
      width: 0;
      opacity: 0;
      border-radius: 8px;
      z-index: 100;
    }
    .${WIDGET_CLASS_NAME}:before {
      content: " ";
      position: fixed;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 70vh;
      width: 40px;
    }
    .${WIDGET_CLASS_NAME}:hover,
    .${WIDGET_CLASS_NAME}.${WIDGET_VISIBLE_CLASS_NAME} {
      width: 260px;
      opacity: 1;
    }
    .${SIDE_BALL_CLASS_NAME} {
      width: 36px;
      height: 36px;
      position: fixed;
      left: 2px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      background: #000;
      border-radius: 50%;
      z-index: 100;
    }
    .${SIDE_BALL_CLASS_NAME}::before {
      content: " ";
      display: none;
      width: 100px;
      height: 100px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    .${SIDE_BALL_CLASS_NAME}:hover::before {
      display: block;
    }
  `
  );

  let ball = parentDocument.querySelector(`.${SIDE_BALL_CLASS_NAME}`);
  if (!ball) {
    ball = parentDocument.createElement("div");
    ball.setAttribute("class", SIDE_BALL_CLASS_NAME);
  }

  let timeoutId: NodeJS.Timeout | null = null;
  const showContent = () => {
    if (nodeWidget) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      todoViewVisible.value = true;
      addClassName(nodeWidget, WIDGET_VISIBLE_CLASS_NAME);
    }
  };

  const closeContent = () => {
    if (nodeWidget) {
      removeClassName(nodeWidget, WIDGET_VISIBLE_CLASS_NAME);

      // transition的时间为0.5s
      timeoutId = setTimeout(() => {
        todoViewVisible.value = false;
      }, 500);
    }
  };

  const postMessageToCloseContent = (e: any) => {
    const { data } = e;
    if (data?.type === "event" && data?.name === "close") {
      closeContent();
    }
  };

  clearAllListeners();

  ball.addEventListener("mouseenter", showContent);
  ball.addEventListener("mouseleave", closeContent);

  parentWindow.addEventListener("message", postMessageToCloseContent);

  allElEventListeners.push([ball, "mouseenter", showContent]);
  allElEventListeners.push([ball, "mouseleave", closeContent]);
  allElEventListeners.push([
    parentWindow,
    "mouseenter",
    postMessageToCloseContent,
  ]);

  parentDocument.body.appendChild(ball);
};

const getBlockKramdownList = async (nodeId: string): Promise<string[]> => {
  const kramdown = await fetchBlockKramdown(nodeId);

  if (!kramdown) {
    console.log("无法获取到页面的kramdown!");
    return [];
  }

  return (kramdown as string).split("\n\n");
};

export const startService = async () => {
  const nodeId = getCurrentPageId(parentDocument);

  if (!nodeId) {
    console.log("无法查找到页面id!");
    return;
  }

  const kramdownList = await getBlockKramdownList(nodeId);
  // 从后向前查询能更快找到
  const todoNodeIndex = kramdownList.findLastIndex((item: string) => {
    return item.includes(BLOCK_TITLE);
  });

  // 如果是第一次使用
  if (todoNodeIndex === -1) {
    let lastBlockKramdown = last(kramdownList)!;
    const lastBlockKramdownList = lastBlockKramdown.split("\n");
    if (lastBlockKramdownList.length > 0) {
      lastBlockKramdown = last(lastBlockKramdownList)!;
    }

    const nodeIdMatched = NODE_ID_RE.exec(lastBlockKramdown);
    if (nodeIdMatched && nodeIdMatched[1]) {
      const lastNodeId = nodeIdMatched[1];
      const insertData = await insertBlock(
        lastNodeId,
        getDefaultInsertContent()
      );

      if (insertData) {
        console.log("待办事项初始化成功");
      }
    }
  }
};

const getTaskListFromKramdownList = (index: number, kramdownList: string[]) => {
  if (index === -1) return [];

  const taskList: { text: string; id: string }[] = [];
  // eslint-disable-next-line no-plusplus
  for (let i = index; i <= kramdownList.length - 1; i++) {
    kramdownList[i].split("\n").forEach((content) => {
      const noAttrContent = content.replace(KRAMDOWN_ATTRIBUTE_RE, "").trim();
      if (noAttrContent.includes("* [ ]") || noAttrContent.includes("* [X]")) {
        taskList.push({
          text: noAttrContent.trim(),
          id: NODE_ID_RE.exec(content)?.[1] || "",
        });
      }
    });
  }

  return taskList;
};

export const getPageTaskList = async (
  nodeId: string = getCurrentPageId(parentDocument)
) => {
  const kramdownList = await getBlockKramdownList(nodeId);
  // 从后向前查询能更快找到
  const index = kramdownList.findLastIndex((item: string) => {
    return item.includes(BLOCK_TITLE);
  });

  return {
    parentId: NODE_ID_RE.exec(kramdownList[index])?.[1] || "",
    list: getTaskListFromKramdownList(index, kramdownList),
  };
};
