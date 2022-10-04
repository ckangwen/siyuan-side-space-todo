import { ref, watch } from "vue";
import { deleteWidget, getPageTaskList, todoViewVisible } from "../../siyuan";
import {
  appendBlock,
  insertBlock,
  updateBlock,
  deleteBlock,
} from "../../utils/request";
import { last } from "../../utils/helper";

interface TaskItem {
  title: string;
  completed: boolean;
  value?: string;
  [k: string]: any;
}

export const useTask = () => {
  const loading = ref(true);

  // 重新排序前的数组
  const originList = ref<TaskItem[]>([]);
  // 会根据是否完成进行重新排序
  const list = ref<TaskItem[]>([]);
  // TODO标题的nodeId
  const parentNodeId = ref("");

  const sortTaskList = () => {
    list.value.sort((a, b) => {
      if (a.completed && !b.completed) {
        return 1;
      }
      if (a.completed === b.completed) return 0;
      return -1;
    });
  };

  const refresh = () => {
    loading.value = true;

    getPageTaskList()
      .then(({ list: taskList, parentId }) => {
        parentNodeId.value = parentId;

        if (Array.isArray(taskList)) {
          const tempList: TaskItem[] = [];
          taskList.forEach((item) => {
            const { text, id } = item;
            if (text.includes("* [ ]")) {
              tempList.push({
                title: text.replace(/\* \[ \]/g, "").trim(),
                completed: false,
                value: id,
              });
            }

            if (text.includes("* [X]")) {
              tempList.push({
                title: text.replace(/\* \[X\]/g, "").trim(),
                completed: true,
                value: id,
              });
            }
          });

          list.value = tempList;
          sortTaskList();

          if (originList.value?.length === 0) {
            originList.value = tempList;
          }
        }
        loading.value = false;
      })
      .catch(() => {
        loading.value = false;
      });
  };

  watch(
    todoViewVisible,
    () => {
      refresh();
    },
    {
      immediate: true,
    }
  );

  const taskName = ref("");
  const onCreate = async () => {
    const hasSame = list.value.find((item: TaskItem) => {
      return item.title === taskName.value;
    });

    if (hasSame) return;
    const taskNameValue = taskName.value.trim();

    const lastNodeId = last(originList.value)?.value;

    let success = false;
    if (lastNodeId) {
      const insertResult = await insertBlock(
        lastNodeId,
        `- [ ] ${taskNameValue}`
      );
      success = insertResult?.length > 0;
    } else if (parentNodeId.value) {
      const insertResult = await appendBlock(
        parentNodeId.value,
        `- [ ] ${taskNameValue}`
      );
      success = insertResult?.length > 0;
    }

    if (success) {
      list.value.push({
        title: taskNameValue,
        completed: false,
        value: "",
      });

      taskName.value = "";
    }
  };

  const onDelete = async (index: number) => {
    const item = list.value[index];
    if (!item.value) return;

    const deleteRes = await deleteBlock(item.value);
    if (deleteRes?.length > 0) {
      list.value.splice(index, 1);
    }
  };

  const onChecked = (index: number) => {
    const item = {
      ...list.value[index],
    };

    const updateMd = `* [${item.completed ? "X" : " "}] ${item.title}`;
    const nodeId = item.value;
    if (nodeId) {
      updateBlock(nodeId, updateMd);
    }

    sortTaskList();
  };

  const onUpdateTitle = (index: number) => {
    const item = list.value[index];
    const updateMd = `- [${item.completed ? "X" : " "}] ${item.title}`;
    if (item.value) {
      updateBlock(item.value, updateMd);
    }
  };

  const AppActions = [
    { label: "刷新", key: "refresh" },
    { label: "关闭", key: "close" },
    { label: "删除挂件", key: "delete" },
  ];

  const onAppActionSelect = async (val: any) => {
    if (val === "close") {
      window.parent?.parent?.postMessage({
        type: "event",
        name: "close",
      });
    }
    if (val === "delete") {
      deleteWidget();
    }
    if (val === "refresh") {
      await refresh();
    }
  };
  return {
    AppActions,
    loading,
    taskName,
    list,

    onCreate,
    onDelete,
    onChecked,
    onUpdateTitle,
    onAppActionSelect,
  };
};
