<script setup lang="ts">
  import { ref } from 'vue';
  import type { ICellEditorParams } from 'ag-grid-community';

  interface SelectOption {
    label: string;
    value: any;
  }

  const props = defineProps<{
    params: ICellEditorParams & {
      options: SelectOption[] | (() => Promise<SelectOption[]>);
      multiple?: boolean;
    };
  }>();

  const value = ref(props.params.value ?? (props.params.multiple ? [] : ''));
  const options = ref<SelectOption[]>([]);
  const selectRef = ref<any>(null);

  // 加载选项
  async function loadOptions() {
    if (typeof props.params.options === 'function') {
      options.value = await props.params.options();
    } else {
      options.value = props.params.options;
    }
  }

  function getValue() {
    return value.value;
  }

  function isCancelBeforeEnd() {
    return false;
  }

  function afterGuiAttached() {
    loadOptions();
    setTimeout(() => {
      selectRef.value?.focus();
    }, 0);
  }

  defineExpose({
    getValue,
    isCancelBeforeEnd,
    afterGuiAttached,
  });
</script>

<template>
  <el-select
    ref="selectRef"
    v-model="value"
    :multiple="params.multiple"
    size="small"
    style="width: 100%"
    @keyup.escape="params.stopEditing(true)"
  >
    <el-option
      v-for="opt in options"
      :key="opt.value"
      :label="opt.label"
      :value="opt.value"
    />
  </el-select>
</template>
