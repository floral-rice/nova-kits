<template>
  <div class="nk-basic-layout-tab-bar">
    <div
      v-for="(tab, index) in tabs"
      :key="tab.path"
      :class="[
        'nk-basic-layout-tab-bar__item',
        { 'nk-basic-layout-tab-bar__item--active': index === active },
        { 'nk-basic-layout-tab-bar__item--fixed': !tab.closable },
      ]"
      @click="$emit('click', index)"
      @contextmenu.prevent="showContextMenu($event, index)"
    >
      <span class="nk-basic-layout-tab-bar__title">{{ tab.title }}</span>
      <el-icon
        v-if="tab.closable"
        class="nk-basic-layout-tab-bar__close"
        @click.stop="$emit('close', index)"
      >
        <Close />
      </el-icon>
    </div>
  </div>

  <!-- 右键菜单 -->
  <teleport to="body">
    <div
      v-if="contextMenu.visible"
      class="nk-basic-layout-tab-bar__context-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
    >
      <div class="nk-basic-layout-tab-bar__context-menu-item" @click="handleRefresh">
        刷新
      </div>
      <div class="nk-basic-layout-tab-bar__context-menu-item" @click="handleCloseOther">
        关闭其他
      </div>
      <div class="nk-basic-layout-tab-bar__context-menu-item" @click="handleCloseAll">
        关闭所有
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue';
import { Close } from '@element-plus/icons-vue';
import type { TabItem } from '../typings';

defineProps<{
  tabs: TabItem[];
  active: number;
}>();

const emit = defineEmits<{
  click: [index: number];
  close: [index: number];
  refresh: [index: number];
  closeOther: [];
  closeAll: [];
}>();

const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  index: -1,
});

const hideContextMenu = () => {
  contextMenu.visible = false;
};

const showContextMenu = (e: MouseEvent, index: number) => {
  // 先关闭已有的菜单，再显示新菜单
  hideContextMenu();
  contextMenu.x = e.clientX;
  contextMenu.y = e.clientY;
  contextMenu.index = index;
  contextMenu.visible = true;
};

const handleRefresh = () => {
  emit('refresh', contextMenu.index);
  hideContextMenu();
};

const handleCloseOther = () => {
  emit('closeOther');
  hideContextMenu();
};

const handleCloseAll = () => {
  emit('closeAll');
  hideContextMenu();
};

onMounted(() => {
  document.addEventListener('click', hideContextMenu);
  document.addEventListener('contextmenu', hideContextMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', hideContextMenu);
  document.removeEventListener('contextmenu', hideContextMenu);
});
</script>

<style scoped lang="scss">
.nk-basic-layout-tab-bar {
  display: flex;
  align-items: center;
  flex: 1;
  overflow-x: auto;
  gap: 4px;
  padding: 0 12px;

  &__item {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;
    font-size: var(--nk-font-sm, 12px);
    color: var(--nk-text-secondary, #666);
    transition: all 0.2s;

    &:hover {
      background: var(--nk-bg-hover, #f5f5f5);
    }

    &--active {
      color: var(--nk-color-primary, #409eff);
      background: var(--nk-bg-primary-light, #ecf5ff);
    }

    &--fixed {
      color: var(--nk-text-primary, #333);
    }
  }

  &__close {
    font-size: 12px;
    border-radius: 50%;
    transition: all 0.2s;

    &:hover {
      background: var(--nk-bg-close-hover, #d9d9d9);
      color: #fff;
    }
  }

  &__context-menu {
    position: fixed;
    z-index: 9999;
    background: var(--nk-bg-menu, #fff);
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    padding: 4px 0;
    min-width: 100px;

    &-item {
      padding: 8px 16px;
      font-size: var(--nk-font-sm, 12px);
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: var(--nk-bg-hover, #f5f5f5);
      }
    }
  }
}
</style>
