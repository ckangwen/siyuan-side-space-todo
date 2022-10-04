export const WIDGET_CLASS_NAME = "siyuan-side-space-todo-view";
export const WIDGET_VISIBLE_CLASS_NAME = "is-visible";
export const SIDE_BALL_CLASS_NAME = "siyuan-side-space-todo-ball";

export const STYLE_ID = "siyuan-side-space-todo-style";

export const last = <T>(arr: T[]): T | undefined => {
  if (!Array.isArray(arr)) return undefined;

  if (arr.length === 0) return undefined;

  return arr[arr.length - 1];
};

export const BLOCK_TITLE = "## TODO";

export const NODE_ID_RE = /id=(?:")([A-Za-z0-9_-]*.)(?:")/;

export const KRAMDOWN_ATTRIBUTE_RE = /{:([^}\n\r]+)}/;

export const getDefaultInsertContent = () => {
  return [
    "\n\n",
    "\n\n",
    "---",
    "\n\n",
    BLOCK_TITLE,
    "* [ ] What",
    "* [ ] Why",
    "* [ ] How",
  ].join("\n");
};

export const isFn = (obj: unknown): obj is Function =>
  typeof obj === "function";
