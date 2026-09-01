<template>
  <div
    class="nv-section"
    :class="[
      props.class,
      {
        'nv-section--flex': flex,
      },
    ]"
    :style="containerStyle"
  >
    <!-- 标题栏 -->
    <div
      v-if="title || $slots.actions"
      class="nv-section__header"
      :class="{ 'nv-section__header--bar': titleBar }"
    >
      <div class="nv-section__title">
        {{ title }}
      </div>
      <slot name="actions" />
    </div>

    <!-- 标签页模式 -->
    <template v-if="tabs && tabs.length > 0">
      <el-tabs
        v-model="activeKey"
        :class="{ 'nv-section__tabs--hidden': hideTabBar }"
        type="card"
        @tab-click="handleTabClick"
      >
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.key"
          :label="tab.title"
          :name="tab.key"
          :lazy="!tab.forceRender"
        >
          <div
            class="nv-section__body"
            :style="bodyStyle"
          >
            <slot :name="`tab-${tab.key}`" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>

    <!-- 普通模式 -->
    <template v-else>
      <div
        class="nv-section__body"
        :style="bodyStyle"
      >
        <slot />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import type { StyleValue, ClassValue } from 'vue';
  import type { TabsPaneContext } from 'element-plus';
  import { ElTabs, ElTabPane } from 'element-plus';

  interface SectionProps {
    /** 标题 */
    title?: string;
    /** 容器样式 */
    style?: StyleValue;
    /** 容器类名 */
    class?: ClassValue;
    /** 标签页配置 */
    tabs?: {
      title?: string;
      key: string;
      forceRender?: boolean;
    }[];
    /** 是否隐藏标签栏 */
    hideTabBar?: boolean;
    /** 内容区域样式 */
    bodyStyle?: StyleValue;
    /** 弹性布局 */
    flex?: boolean | number;
    /** 是否启用标题背景色 */
    titleBar?: boolean;
  }

  const props = withDefaults(defineProps<SectionProps>(), {
    hideTabBar: false,
    titleBar: false,
  });

  const emit = defineEmits<{
    'tab-change': [activeKey: string, activeIndex: number];
  }>();

  /** 当前激活的标签 */
  const activeKey = ref<string>(props.tabs?.[0]?.key || '');

  /** 监听 tabs 变化，重置 activeKey */
  watch(
    () => props.tabs,
    newTabs => {
      if (newTabs && newTabs.length > 0) {
        activeKey.value = newTabs[0].key;
      }
    },
    { immediate: true }
  );

  /** 容器样式 */
  const containerStyle = computed<StyleValue>(() => {
    if (props.flex) {
      const flexStyle: Record<string, unknown> = {
        flex: typeof props.flex === 'number' ? props.flex : 1,
      };
      if (props.style && typeof props.style === 'object' && !Array.isArray(props.style)) {
        return { ...flexStyle, ...props.style } as StyleValue;
      }
      return [flexStyle, props.style] as StyleValue;
    }
    return props.style;
  });

  /** 标签点击事件 */
  const handleTabClick = (tab: TabsPaneContext) => {
    const key = tab.paneName as string;
    const index = props.tabs?.findIndex(t => t.key === key) || 0;
    emit('tab-change', key, index);
  };
</script>

<style scoped lang="scss">
  .nv-section {
    position: relative;
    width: 100%;
    padding: 16px;
    color: var(--el-text-color-primary);

    & + & {
      padding-top: 0;
    }

    &--flex {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    &--flex &__body {
      flex: 1 1 100%;
      min-height: 0;
    }

    &__header {
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      &--bar {
        height: 32px;
        padding-left: 8px;
        background: var(--el-fill-color-light);
        border-radius: 2px;
      }
    }

    &__title {
      flex: 1;
      font-weight: 700;
      font-size: 14px;
      line-height: 22px;

      &::before {
        display: inline-block;
        width: 4px;
        height: 16px;
        margin-right: 8px;
        vertical-align: -0.2em;
        background-color: var(--el-color-primary);
        border-radius: 1px;
        content: '';
      }
    }

    &__body {
      & > :deep(.el-table) {
        border-radius: 6px 6px 0 0;
      }
    }

    &__tabs--hidden {
      :deep(.el-tabs__header) {
        display: none;
      }
    }
  }
</style>
