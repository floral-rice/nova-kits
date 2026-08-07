<script setup lang="ts">
  import { ref } from 'vue';
  import type { ICellEditorParams } from 'ag-grid-community';

  const props = defineProps<{
    params: ICellEditorParams & {
      min?: number;
      max?: number;
      precision?: number;
      step?: number;
    };
  }>();

  const value = ref(props.params.value ?? 0);
  const inputRef = ref<any>(null);

  function getValue() {
    return value.value;
  }

  function isCancelBeforeEnd() {
    return false;
  }

  function afterGuiAttached() {
    setTimeout(() => {
      inputRef.value?.focus();
    }, 0);
  }

  defineExpose({
    getValue,
    isCancelBeforeEnd,
    afterGuiAttached,
  });
</script>

<template>
  <el-input-number
    ref="inputRef"
    v-model="value"
    :min="params.min"
    :max="params.max"
    :precision="params.precision"
    :step="params.step"
    size="small"
    controls-position="right"
    @keyup.enter="params.stopEditing()"
    @keyup.escape="params.stopEditing(true)"
  />
</template>
