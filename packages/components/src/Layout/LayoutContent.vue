<template>
  <div :class="[prefix('content-wrapper')]">
    <div
      v-if="$slots.left"
      :class="[prefix('sidebar'), { [prefix('sidebar-collapsed')]: collapsed }]"
    >
      <div
        :class="[prefix('left')]"
        :style="{ width: collapsed ? 0 : currentSidebarWidth + 'px' }"
      >
        <div :class="[prefix('left-body')]">
          <slot name="left" />
        </div>
      </div>
      <div
        v-if="!collapsed"
        :class="[prefix('resize-handle')]"
        @mousedown="onResizeStart"
      />
      <div
        :class="[prefix('left-collapse-btn')]"
        @click="toggleCollapse"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M8 1L4 6L8 11"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
    <div :class="[prefix('content')]">
      <div :class="[prefix('content-scroll')]">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { prefixClassName } from '../utils';

const prefix = prefixClassName('layout');

const props = withDefaults(defineProps<{
  defaultSidebarWidth?: number;
  collapsed?: boolean;
}>(), {
  defaultSidebarWidth: 242,
  collapsed: false,
});

const emit = defineEmits<{
  'update:collapsed': [value: boolean];
  collapse: [value: boolean];
}>();

// 侧边栏宽度 - 组件内部维护
const currentSidebarWidth = ref(props.defaultSidebarWidth);

// 拖拽调整宽度
const dragging = ref(false);
const startX = ref(0);
const startWidth = ref(0);

function onResizeStart(e: MouseEvent) {
  if (props.collapsed) return;
  e.preventDefault();
  dragging.value = true;
  startX.value = e.clientX;
  startWidth.value = currentSidebarWidth.value;
  document.addEventListener('mousemove', onResizeMove);
  document.addEventListener('mouseup', onResizeEnd);
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
}

function onResizeMove(e: MouseEvent) {
  if (!dragging.value) return;
  const diff = e.clientX - startX.value;
  currentSidebarWidth.value = Math.max(200, Math.min(600, startWidth.value + diff));
}

function onResizeEnd() {
  dragging.value = false;
  document.removeEventListener('mousemove', onResizeMove);
  document.removeEventListener('mouseup', onResizeEnd);
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
}

function toggleCollapse() {
  const newCollapsed = !props.collapsed;
  emit('update:collapsed', newCollapsed);
  emit('collapse', newCollapsed);
}

onUnmounted(() => {
  document.removeEventListener('mousemove', onResizeMove);
  document.removeEventListener('mouseup', onResizeEnd);
});
</script>

<style scoped lang="scss">
.nova-layout {
  &-content-wrapper {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: row;
    overflow: hidden;
  }

  &-sidebar {
    position: relative;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    overflow: hidden;
  }

  &-left {
    overflow: hidden;
    transition: width 0.2s;
    display: flex;
    flex-direction: column;

    &-body {
      flex: 1;
      min-height: 0;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }

  &-left-collapse-btn {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: $padding-md;
    height: 32px;
    margin-top: 50%;
    background: var(--el-bg-color, #fff);
    border: 1px solid var(--el-border-color-lighter);
    border-left: none;
    border-top-right-radius: $padding-xs;
    border-bottom-right-radius: $padding-xs;
    cursor: pointer;
    transform: translateY(-50%);
    transition: transform 0.3s, color 0.2s;

    &:hover {
      color: var(--el-color-primary);
    }
  }

  &-sidebar-collapsed &-left-collapse-btn {
    transform: translateY(-50%) rotateY(180deg);
  }

  &-resize-handle {
    width: 4px;
    align-self: stretch;
    cursor: col-resize;
    background-color: var(--el-border-color-lighter);
    transition: background-color 0.2s;
    flex-shrink: 0;

    &:hover {
      background-color: var(--el-color-primary-light-7);
    }
  }

  &-content {
    flex: 1;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  &-content-scroll {
    flex: 1;
    min-height: 0;
    overflow: auto;
  }
}
</style>
