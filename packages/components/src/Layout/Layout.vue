<template>
  <div
    class="nv-layout"
    :class="[props.class]"
    :style="style"
  >
    <div
      v-if="$slots.header"
      class="nv-layout-header"
    >
      <slot name="header" />
      <div :id="teleportIds.header" />
    </div>
    <LayoutContent
      :default-sidebar-width="defaultSidebarWidth"
      :collapsed="collapsed"
      @update:collapsed="$emit('update:collapsed', $event)"
      @collapse="$emit('collapse', $event)"
    >
      <template
        v-if="$slots.left"
        #left
      >
        <slot name="left" />
      </template>
      <slot />
    </LayoutContent>
    <div
      v-if="$slots.footer"
      class="nv-layout-footer"
    >
      <slot name="footer" />
      <div :id="teleportIds.footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useId, computed } from 'vue';
  import LayoutContent from './LayoutContent.vue';
  import { provideLayoutContext } from './composables/useLayoutContext';
  import type { LayoutProps } from './typing';

  const props = withDefaults(defineProps<LayoutProps>(), {
    defaultSidebarWidth: 242,
    collapsed: false,
    activeKey: undefined,
    class: undefined,
    style: undefined,
  });

  defineEmits<{
    'update:collapsed': [value: boolean];
    collapse: [value: boolean];
  }>();

  const layoutId = useId();
  const teleportIds = {
    header: `nova-layout-header-${layoutId}`,
    footer: `nova-layout-footer-${layoutId}`,
  };

  provideLayoutContext({
    teleportIds,
    activeKey: computed(() => props.activeKey),
  });
</script>

<style scoped lang="scss">
  .nv-layout {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
    position: relative;
    overflow: hidden;

    &-header {
      padding: 0 var(--nk-padding-md);
      flex-shrink: 0;
    }

    &-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      height: 44px;
      padding: 0 var(--nk-padding-md);
      background: #fff;
      box-shadow: inset 0 1px 0 0 #dfdfdf;
      flex-shrink: 0;
    }
  }
</style>
