<script setup lang="ts">
  import { ref } from 'vue';
  import type { ICellEditorParams } from 'ag-grid-community';

  const props = defineProps<{
    params: ICellEditorParams;
  }>();

  const value = ref(props.params.value);
  const inputRef = ref<any>(null);

  // AG Grid 接口
  function getValue() {
    return value.value;
  }

  function isCancelBeforeEnd() {
    return false;
  }

  function afterGuiAttached() {
    inputRef.value?.focus();
  }

  // 暴露给 AG Grid
  defineExpose({
    getValue,
    isCancelBeforeEnd,
    afterGuiAttached,
  });
</script>

<template>
  <div class="nv-grid__editor-wrapper">
    <slot
      :value="value"
      :input-ref="inputRef"
    />
  </div>
</template>

<style lang="scss" scoped>
  .nv-grid__editor-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
</style>
