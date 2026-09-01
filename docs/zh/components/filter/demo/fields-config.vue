<template>
  <NFilter
    v-model:value="filterValues"
    :data="filterData"
    enable-fields-config
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
    { key: 'amount', label: '金额', type: 'input-number' },
  ];
</script>
