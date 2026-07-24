<template>
  <div
    v-loading="loading"
    :class="[prefix('tabs-layout'), props.class]"
    :style="style"
    element-loading-background="rgba(255, 255, 255, 0.5)"
  >
    <div v-if="$slots.header" :class="[prefix('header')]">
      <slot name="header" />
      <div :id="teleportIds.header" />
    </div>
    <div :class="[prefix('tabs-wrapper')]">
      <ElTabs
        v-model="currentActiveKey"
        :class="prefix('tabs')"
        @tab-click="onTabClick"
      >
        <ElTabPane
          v-for="tab in tabs"
          :key="tab.key"
          :label="tab.label || tab.key"
          :name="tab.key"
        >
          <LayoutContent
            :default-sidebar-width="defaultSidebarWidth"
            :collapsed="collapsed"
            @update:collapsed="$emit('update:collapsed', $event)"
            @collapse="$emit('collapse', $event)"
          >
            <template v-if="$slots.left" #left>
              <slot name="left" />
            </template>
            <slot :name="tab.key" />
          </LayoutContent>
        </ElTabPane>
      </ElTabs>
    </div>
    <div v-if="$slots.footer" :class="[prefix('footer')]">
      <slot name="footer" />
      <div :id="teleportIds.footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ClassValue, type StyleValue, computed, useId } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import { prefixClassName } from '../utils';
import LayoutContent from './LayoutContent.vue';
import { provideLayoutContext } from './composables/useLayoutContext';

const prefix = prefixClassName('layout');

export interface Tab {
  label?: string;
  key: string;
}

export interface LayoutTabsProps {
  tabs?: Tab[];
  activeKey?: string;
  defaultSidebarWidth?: number;
  collapsed?: boolean;
  loading?: boolean;
  class?: ClassValue;
  style?: StyleValue;
}

const props = withDefaults(defineProps<LayoutTabsProps>(), {
  tabs: () => [],
  activeKey: undefined,
  defaultSidebarWidth: 242,
  collapsed: false,
  loading: false,
  class: undefined,
  style: undefined,
});

const emit = defineEmits<{
  'update:activeKey': [value: string];
  'update:collapsed': [value: boolean];
  'tab-click': [key: string];
  collapse: [value: boolean];
}>();

const currentActiveKey = computed({
  get: () => props.activeKey ?? props.tabs[0]?.key,
  set: (val) => emit('update:activeKey', val),
});

function onTabClick(pane: { paneName?: string | number }, _ev: Event) {
  emit('tab-click', String(pane.paneName ?? ''));
}

// 提供 layout context 给 Portal 使用
const layoutId = useId();
const teleportIds = {
  header: `nova-layout-header-${layoutId}`,
  footer: `nova-layout-footer-${layoutId}`,
};

provideLayoutContext({
  teleportIds,
  activeKey: currentActiveKey,
});
</script>

<style scoped lang="scss">
.nova-layout {
  &-tabs-layout {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
    position: relative;
    overflow: hidden;
  }

  &-header {
    padding: 0 $padding-md;
    flex-shrink: 0;
  }

  &-tabs-wrapper {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  &-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;

    :deep(.el-tabs__header) {
      margin: 0 $padding-md;
      flex-shrink: 0;
    }

    :deep(.el-tabs__content) {
      padding: 0;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }

    :deep(.el-tab-pane) {
      height: 100%;
    }
  }

  &-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 44px;
    padding: 0 $padding-md;
    background: #fff;
    box-shadow: inset 0 1px 0 0 #dfdfdf;
    flex-shrink: 0;
  }
}
</style>
