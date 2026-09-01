<template>
  <NFilter
    v-model:value="filterValues"
    :data="filterData"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { NFilter } from '@nova-kits/components';
  import type { FilterItemType } from '@nova-kits/components';

  const filterValues = ref({});

  const filterData: FilterItemType[] = [
    { key: 'name', label: '姓名', type: 'input' },
    { key: 'status', label: '状态', type: 'select' },
    { key: 'date', label: '日期', type: 'date-picker' },
    { key: 'date', label: '日期', type: 'date-picker' },
    { key: 'date', label: '日期', type: 'date-picker' },
    { key: 'date', label: '日期', type: 'date-picker' },
    { key: 'date', label: '日期', type: 'date-picker' },
  ];

  const handleChange = (values: Record<string, any>, actionType: string) => {
    console.log('筛选值:', values, '操作类型:', actionType);
  };
</script>
