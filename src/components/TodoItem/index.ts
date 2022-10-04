import { ref, watch, nextTick, h } from "vue";
import { onClickOutside, useVModel } from "@vueuse/core";
import Icon from "../Icon.vue";

export const TodoItemActions = [
  {
    label: "删除",
    key: "delete",
    icon: () =>
      h(Icon, {
        name: "delete",
      }),
  },
];

export const useTodoItem = (
  props: Record<string, any>,
  emit: (...args: any) => void
) => {
  const readonly = ref(true);

  const innerValue = ref("");

  watch(
    () => props.title,
    (val) => {
      if (val) {
        innerValue.value = val;
      }
    },
    {
      immediate: true,
    }
  );

  const inputRef = ref();
  const onStartEdit = () => {
    if (readonly.value === false) return;

    readonly.value = false;

    nextTick().then(() => {
      inputRef.value?.focus();
    });
  };

  const onCancel = () => {
    innerValue.value = props.title;
    readonly.value = true;
  };
  onClickOutside(inputRef, onCancel);

  const onConfirm = () => {
    readonly.value = true;
    emit("update:title", innerValue.value);
  };

  const innerCompleted = useVModel(props, "completed", emit);
  const onCheckedChange = () => {
    innerCompleted.value = !innerCompleted.value;
  };

  const onTaskActionSelect = (key: string) => {
    if (key === "delete") {
      emit("delete");
    }
  };

  return {
    inputRef,
    readonly,
    innerValue,
    innerCompleted,

    onStartEdit,
    onConfirm,
    onCancel,
    onCheckedChange,
    onTaskActionSelect,
  };
};
