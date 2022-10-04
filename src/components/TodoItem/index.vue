<script lang="ts" setup>
import Icon from "../Icon.vue";
import { useTodoItem, TodoItemActions } from "./index";
const props = defineProps<{
  title: string;
  completed: boolean;
}>();

const emits = defineEmits([
  "update:title",
  "update:completed",
  "delete",
  "checked",
]);

const {
  inputRef,
  readonly,
  innerValue,
  innerCompleted,

  onStartEdit,
  onConfirm,
  onCancel,
  onCheckedChange,
  onTaskActionSelect,
} = useTodoItem(props, emits);
</script>

<template>
  <div class="todo-item">
    <div
      class="flex items-center flex-auto box-border"
      style="padding: 8px 10px 6px 12px"
      @dblclick="onStartEdit"
    >
      <n-checkbox
        :checked="innerCompleted"
        @update:checked="onCheckedChange"
      ></n-checkbox>
      <span v-if="readonly" class="ml-1 todo-item-title">{{ title }}</span>
      <input
        v-else
        ref="inputRef"
        v-model="innerValue"
        class="pure-input ml-1"
        autofocus
        @keyup.enter="onConfirm"
        @blur="onCancel"
      />
    </div>

    <div class="action-group">
      <Icon class="action-item" name="edit" @click="onStartEdit"></Icon>
      <n-dropdown
        trigger="click"
        :options="TodoItemActions"
        size="small"
        :show-arrow="true"
        @select="onTaskActionSelect"
      >
        <Icon class="action-item" name="more"></Icon>
      </n-dropdown>
    </div>
  </div>
</template>

<style lang="scss">
.todo-item {
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: var(--task-border-radius);
  position: relative;
  box-sizing: border-box;
  background-color: var(--task-background-color);
  // box-shadow: var(--task-shadow);
  border: 1px solid var(--task-action-border-color);
  color: var(--task-foreground-color);
  margin-bottom: 8px;
  cursor: pointer;

  // &::before {
  //   content: " ";
  //   position: absolute;
  //   border-top-left-radius: var(--task-border-radius);
  //   border-bottom-left-radius: var(--task-border-radius);
  //   height: 100%;
  //   width: 6px;
  //   background-color: #ff942f;
  //   top: 0;
  //   left: -1px;
  // }

  // .n-checkbox {
  //   opacity: 0;
  //   --n-size: 0 !important;
  //   transition: all 1s;

  //   .n-checkbox-box-wrapper {
  //     transition: all 0.5s;
  //   }
  // }

  // &:hover {
  //   .n-checkbox {
  //     opacity: 1;
  //     --n-size: 16px !important;
  //     transition: all 1s;
  //   }
  // }

  &-title {
    font-size: 14px;
    line-height: 22px;
    user-select: none;
  }

  .action-group {
    display: none;
  }

  &:hover {
    .action-group {
      display: flex;
    }
  }
}

.pure-input {
  outline: 0;
  border: 0;
  padding-left: 4px;
  color: #000;
}
</style>
