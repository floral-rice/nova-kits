<script setup lang="ts">
  import { ref } from 'vue';
  import type { ICellEditorParams } from 'ag-grid-community';

  const props = defineProps<{
    params: ICellEditorParams & {
      format?: string;
      valueFormat?: string;
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
  <el-date-picker
    ref="inputRef"
    v-model="value"
    :format="params.format || 'YYYY-MM-DD'"
    :value-format="params.valueFormat || 'YYYY-MM-DD'"
    size="small"
    style="width: 100%"
    @keyup.escape="params.stopEditing(true)"
  />
</template>
