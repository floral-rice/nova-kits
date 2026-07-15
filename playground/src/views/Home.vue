<template>
  <div class="home">
    <h1>Nova UI Playground</h1>
    <div class="component-list">
      <router-link
        v-for="component in components"
        :key="component.name"
        :to="`/component/${component.name}`"
        class="component-item"
      >
        <span class="component-name">{{ component.name }}</span>
        <span class="demo-count">{{ component.demos.length }} demo(s)</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { components } from 'virtual:nova-kits-components';
</script>

<style scoped>
.home {
  padding: 20px;
}

h1 {
  margin-bottom: 24px;
  color: #333;
}

.component-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.component-item {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  transition: all 0.2s;
}

.component-item:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.component-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.demo-count {
  font-size: 14px;
  color: #666;
}
</style>
