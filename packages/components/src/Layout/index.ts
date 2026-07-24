export { default as NLayout } from './Layout.vue';
export { default as NLayoutTabs } from './LayoutTabs.vue';
export { default as NLayoutPortal } from './LayoutPortal.vue';
export { default as NLayoutContent } from './LayoutContent.vue';
export { useTabFocus } from './composables/useLayoutContext';

// 复合组件模式：NLayout.Tabs, NLayout.Portal
import _NLayout from './Layout.vue';
import _NLayoutTabs from './LayoutTabs.vue';
import _NLayoutPortal from './LayoutPortal.vue';

export const NLayoutWithSub = _NLayout as typeof _NLayout & {
  Tabs: typeof _NLayoutTabs;
  Portal: typeof _NLayoutPortal;
};

(NLayoutWithSub as any).Tabs = _NLayoutTabs;
(NLayoutWithSub as any).Portal = _NLayoutPortal;
