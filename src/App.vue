<script lang="ts">
export default { name: "App" };
</script>
<script lang="ts" setup>
import { NConfigProvider, zhCN } from "naive-ui";
import Task from "./components/Task/index.vue";
</script>
<template>
  <NConfigProvider :locale="zhCN" class="h-full">
    <Task></Task>
  </NConfigProvider>
</template>

<style lang="scss">
html {
  height: 100vh;
  overflow: hidden;
  user-select: none;
}
body,
#app {
  height: 100%;
  user-select: none;
}
</style>
