<script lang="ts">
export default { name: "Task" };
</script>
<script lang="ts" setup>
import Icon from "../Icon.vue";
import TodoItem from "../TodoItem/index.vue";
import { useTask } from "./useTask";

const {
  AppActions,
  loading,
  taskName,
  list,

  onCreate,
  onDelete,
  onChecked,
  onUpdateTitle,
  onAppActionSelect,
} = useTask();
</script>
<template>
  <div
    class="p-4 box-border"
    h="full"
    w="full"
    flex="~"
    justify="center"
    overflow="x-hidden y-auto"
    whitespace="nowrap"
  >
    <div flex="~ col" class="w-full">
      <div
        flex="~"
        justify="between"
        items="center"
        position="relative"
        m="b-2"
        class="app-header"
      >
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
        m="b-4"
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
          @update:completed="onChecked(index)"
          @update:title="onUpdateTitle(index)"
        ></TodoItem>
      </div>

      <div v-if="list.length === 0" class="empty-description">
        <Icon name="empty" style="font-size: 20px"></Icon>
        {{ loading ? "数据加载中..." : "暂无待办事项" }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.empty-description {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  color: #88889f;
}
</style>
