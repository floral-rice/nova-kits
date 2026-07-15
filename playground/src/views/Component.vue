<template>
  <div class="component-page">
    <div class="sidebar">
      <div class="sidebar-header">
        <router-link
          to="/"
          class="back-link"
        >
          &larr; 返回
        </router-link>
        <h2>{{ componentName }}</h2>
      </div>
      <div class="demo-list">
        <div
          v-for="demo in demos"
          :key="demo.name"
          class="demo-item"
          :class="{ active: currentDemo === demo.name }"
          @click="currentDemo = demo.name"
        >
          {{ demo.name }}
        </div>
      </div>
    </div>
    <div class="content">
      <div class="demo-container">
        <div class="demo-header">
          <h3>{{ currentDemo }}</h3>
        </div>
        <div class="demo-content">
          <component :is="currentDemoComponent" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getComponent } from 'virtual:nova-kits-components';

const route = useRoute();
const componentName = computed(function() { return route.params.name as string; });
const component = computed(function() { return getComponent(componentName.value); });
const demos = computed(function() { 
  if (component.value) {
    return component.value.demos;
  }
  return [];
});
const currentDemo = ref('');
if (demos.value.length) {
  currentDemo.value = demos.value[0].name;
}

const currentDemoComponent = computed(function() {
  const demo = demos.value.find(function(d) { return d.name === currentDemo.value; });
  if (demo) {
    return demo.component;
  }
  return null;
});
</script>

<style scoped>
.component-page {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 240px;
  background: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.back-link {
  display: block;
  margin-bottom: 8px;
  color: #409eff;
  text-decoration: none;
  font-size: 14px;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 20px;
}

.demo-list {
  flex: 1;
  padding: 8px 0;
  overflow-y: auto;
}

.demo-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.demo-item:hover {
  background: #e8e8e8;
}

.demo-item.active {
  background: #409eff;
  color: white;
}

.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.demo-container {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.demo-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
}

.demo-header h3 {
  margin: 0;
  font-size: 18px;
}

.demo-content {
  padding: 24px;
  min-height: 300px;
}
</style>
