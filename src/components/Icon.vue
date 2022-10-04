<script lang="ts">
export default { name: "Icon" };
</script>
<script lang="ts" setup>
defineProps<{
  name: string;
}>();
</script>

<template>
  <span class="iconfont" :class="`icon-${name}`"></span>
</template>
