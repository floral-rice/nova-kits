<script setup lang="ts">
  import { ref } from 'vue';
  import type { ICellEditorParams } from 'ag-grid-community';

  const props = defineProps<{
    params: ICellEditorParams & {
      maxLength?: number;
      disabled?: boolean;
    };
  }>();

  const value = ref(props.params.value || '');
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
  <el-input
    ref="inputRef"
    v-model="value"
    :maxlength="params.maxLength"
    :disabled="params.disabled"
    size="small"
    @keyup.enter="params.stopEditing()"
    @keyup.escape="params.stopEditing(true)"
  />
</template>
