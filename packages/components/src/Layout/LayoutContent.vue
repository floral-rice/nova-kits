<template>
  <div class="nv-layout-content-wrapper">
    <Splitpanes
      v-if="$slots.left"
      class="nv-layout-splitpanes default-theme"
      @resize="onResize"
    >
      <Pane
        :size="collapsed ? 0 : sidebarPercent"
        :min-size="collapsed ? 0 : 10"
        :max-size="collapsed ? 0 : 50"
        class="nv-layout-left"
        :class="[{ 'nv-layout-left-collapsed': collapsed }]"
      >
        <div class="nv-layout-left-body">
          <slot name="left" />
        </div>
      </Pane>
      <Pane :size="collapsed ? 100 : 100 - sidebarPercent">
        <div class="nv-layout-content">
          <div class="nv-layout-content-scroll">
            <slot />
          </div>
        </div>
      </Pane>
    </Splitpanes>
    <template v-else>
      <div class="nv-layout-content">
        <div class="nv-layout-content-scroll">
          <slot />
        </div>
      </div>
    </template>
    <div
      v-if="$slots.left"
      class="nv-layout-left-collapse-btn"
      :class="[{ 'nv-layout-left-collapse-btn-collapsed': collapsed }]"
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
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { Splitpanes, Pane } from 'splitpanes';
  import 'splitpanes/dist/splitpanes.css';
  import type { LayoutContentProps } from './typing';

  const props = withDefaults(defineProps<LayoutContentProps>(), {
    defaultSidebarWidth: 242,
    collapsed: false,
    containerWidth: 1000,
  });

  const emit = defineEmits<{
    'update:sidebarWidth': [value: number];
    'update:collapsed': [value: boolean];
    collapse: [value: boolean];
  }>();

  // 侧边栏宽度 - 组件内部维护
  const currentSidebarWidth = ref(props.defaultSidebarWidth);

  // 计算侧边栏百分比
  const sidebarPercent = computed(() => {
    return Math.min(50, Math.max(10, (currentSidebarWidth.value / props.containerWidth) * 100));
  });

  // 拖拽调整宽度
  function onResize(event: { panes: { size: number }[] }) {
    if (props.collapsed) return;
    const leftSize = event.panes[0].size;
    const newWidth = Math.round((leftSize / 100) * props.containerWidth);
    currentSidebarWidth.value = newWidth;
    emit('update:sidebarWidth', newWidth);
  }

  function toggleCollapse() {
    const newCollapsed = !props.collapsed;
    emit('update:collapsed', newCollapsed);
    emit('collapse', newCollapsed);
  }
</script>

<style scoped lang="scss">
  .nv-layout {
    &-content-wrapper {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: row;
      overflow: hidden;
      position: relative;
    }

    &-splitpanes {
      height: 100%;
    }

    &-left {
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      &-collapsed {
        min-width: 0 !important;
      }

      &-body {
        flex: 1;
        min-height: 0;
        overflow-x: hidden;
        overflow-y: auto;
      }
    }

    &-left-collapse-btn {
      position: absolute;
      top: 50%;
      left: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--nk-padding-md);
      height: 32px;
      background: var(--el-bg-color, #fff);
      border: 1px solid var(--el-border-color-lighter);
      border-right: none;
      border-top-right-radius: var(--nk-padding-xs);
      border-bottom-right-radius: var(--nk-padding-xs);
      cursor: pointer;
      transform: translateY(-50%);
      transition:
        transform 0.3s,
        color 0.2s;

      &:hover {
        color: var(--el-color-primary);
      }

      &-collapsed {
        left: 0;
        transform: translateY(-50%) rotateY(180deg);
      }
    }

    &-content {
      flex: 1;
      min-width: 0;
      min-height: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    &-content-scroll {
      flex: 1;
      min-height: 0;
      overflow: auto;
    }
  }

  // splitpanes 样式覆盖
  :deep(.splitpanes.default-theme .splitpanes__splitter) {
    background-color: var(--el-border-color-lighter);
    border: none;

    &:hover {
      background-color: var(--el-color-primary-light-7);
    }
  }
</style>
