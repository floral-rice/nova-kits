<template>
  <div style="height: 300px">
    <NDataGrid
      :data-source="data"
      :columns="columns"
      row-key="id"
      :summary="{ sum: ['amount', 'quantity'], avg: ['price'] }"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { NDataGrid } from '@nova-kits/components';

  const data = ref([
    { id: 1, product: '商品A', price: 100, quantity: 5, amount: 500 },
    { id: 2, product: '商品B', price: 200, quantity: 3, amount: 600 },
    { id: 3, product: '商品C', price: 150, quantity: 8, amount: 1200 },
    { id: 4, product: '商品D', price: 80, quantity: 10, amount: 800 },
  ]);

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '商品', dataIndex: 'product' },
    { title: '单价', dataIndex: 'price' },
    { title: '数量', dataIndex: 'quantity' },
    { title: '金额', dataIndex: 'amount' },
  ];
</script>
