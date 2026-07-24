import { type InjectionKey, type Ref, inject, provide, computed } from 'vue';

export interface LayoutContext {
  teleportIds: {
    header: string;
    footer: string;
  };
  activeKey: Ref<string | undefined>;
}

export const LAYOUT_CONTEXT_KEY: InjectionKey<LayoutContext> = Symbol('layout-context');

export function useLayoutContext() {
  return inject(LAYOUT_CONTEXT_KEY, null);
}

export function provideLayoutContext(context: LayoutContext) {
  provide(LAYOUT_CONTEXT_KEY, context);
}

export function useTabFocus(key: string) {
  const ctx = useLayoutContext();
  if (!ctx) {
    return computed(() => true);
  }
  return computed(() => ctx.activeKey.value === key);
}
