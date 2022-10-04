<script lang="ts">
export default { name: "App" };
</script>
<script lang="ts" setup>
import { ref } from "vue";
import { NConfigProvider, zhCN } from "naive-ui";
import Icon from "./components/Icon.vue";
import TodoItem from "./components/TodoItem/index.vue";
import { deleteWidget } from "./siyuan";

interface TaskItem {
  title: string;
  completed: boolean;
  value?: string;
  [k: string]: any;
}

const list = ref<TaskItem[]>([
  { title: "测试1", completed: false },
  { title: "测试2", completed: true },
  { title: "测试3", completed: false },
]);

const taskName = ref("");
const onCreate = () => {
  const hasSame = list.value.find((item: TaskItem) => {
    return item.title === taskName.value;
  });

  if (hasSame) return;

  list.value.push({
    title: taskName.value,
    completed: false,
  });

  taskName.value = "";
};

const AppActions = [
  { label: "关闭", key: "close" },
  { label: "删除挂件", key: "delete" },
];

const onAppActionSelect = (val: any) => {
  if (val === "close") {
    window.parent?.parent?.postMessage({
      type: "event",
      name: "close",
    });
  }

  if (val === "delete") {
    deleteWidget();
  }
};

const onDelete = (index: number) => {
  list.value.splice(index, 1);
};
</script>
<template>
  <NConfigProvider :locale="zhCN">
    <div class="flex justify-center w-full p-4 box-border">
      <div class="flex flex-col w-full">
        <div class="app-header">
          <span class="font-500 text-lg">待办事项</span>

          <div class="action-group">
            <n-dropdown
              trigger="click"
              :options="AppActions"
              size="small"
              :show-arrow="true"
              @select="onAppActionSelect"
            >
              <Icon class="action-item" name="more"></Icon>
            </n-dropdown>
          </div>
        </div>

        <n-input
          v-model:value="taskName"
          class="mb-4"
          size="small"
          type="text"
          placeholder="添加新的待办事项, 回车即可创建"
          @keyup.enter="onCreate"
        />

        <div v-for="(item, index) in list" :key="index" class="flex">
          <TodoItem
            v-model:title="item.title"
            v-model:completed="item.completed"
            @delete="onDelete(index)"
          ></TodoItem>
        </div>

        <div v-if="list.length === 0" class="empty-description">
          <Icon name="empty" style="font-size: 20px"></Icon>
          暂无待办事项
        </div>
      </div>
    </div>
  </NConfigProvider>
</template>

<style lang="scss">
.app-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.empty-description {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  color: #88889f;
}
</style>
