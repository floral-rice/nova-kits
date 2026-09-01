<template>
  <NFilter
    v-model:value="filterValues"
    :data="filterData"
  />
</template>

<script setup lang="ts">
  import { ref, h } from 'vue';
  import { ElTag } from 'element-plus';
  import { NFilter } from '@nova-kits/components';
  import type { FilterItemType } from '@nova-kits/components';

  const filterValues = ref({});

  const filterData: FilterItemType[] = [
    { key: 'name', label: '姓名', type: 'input' },
    {
      key: 'custom',
      label: '自定义',
      renderFormItem: () => h(ElTag, { type: 'success' }, () => '自定义内容'),
    },
  ];
</script>
