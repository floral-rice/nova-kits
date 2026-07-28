<template>
  <div
    v-loading="authLoading"
    class="nk-basic-layout"
  >
    <NavHeader
      :title="title"
      :logo="logo"
      :tabs="tabs"
      :active="active"
      @tab-click="handleTabClick"
      @tab-close="handleCloseTab"
      @tab-refresh="handleRefreshTab"
      @tab-close-other="handleCloseOtherTabs"
      @tab-close-all="handleCloseAllTabs"
    >
      <template #right>
        <slot name="right" />
      </template>
    </NavHeader>

    <div class="nk-basic-layout__body">
      <SideMenu
        v-model:collapse="collapseState"
        :menus="filteredMenus"
        :default-active="route.path"
      />

      <div class="nk-basic-layout__content">
        <slot>
          <router-view v-slot="{ Component: RouteComponent, route: viewRoute }">
            <keep-alive
              ref="keepAliveRef"
              :include="[...visitedPaths]"
            >
              <component
                :is="RouteComponent"
                :key="getTabKey(viewRoute)"
              />
            </keep-alive>
          </router-view>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, type ComponentPublicInstance } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import NavHeader from './components/NavHeader.vue';
  import SideMenu from './components/SideMenu.vue';
  import useAuth from './composables/useAuth';
  import useTabs from './composables/useTabs';
  import useMenuFilter from './composables/useMenuFilter';
  import type { BasicLayoutProps } from './typings';

  const props = defineProps<BasicLayoutProps>();

  const route = useRoute();
  const router = useRouter();

  // 鉴权
  const { loading: authLoading, checkAuth } = useAuth(props.auth);

  // 标签页
  const { tabs, active, closeTab, refreshTab, closeOtherTabs, closeAllTabs } = useTabs(
    props.topTabs
  );

  // 折叠状态（支持外部控制和内部切换）
  const collapseState = ref(props.collapse === true);

  watch(
    () => props.collapse,
    (val: boolean | undefined) => {
      if (val !== undefined) collapseState.value = val;
    }
  );

  // 菜单过滤
  const filteredMenus = useMenuFilter(
    () => props.menus,
    () => props.authorities ?? []
  );

  // 已访问路径集合（用于 keep-alive include）
  const visitedPaths = ref(new Set<string>());

  // keep-alive 组件引用
  const keepAliveRef = ref<ComponentPublicInstance | null>(null);

  // 清除 keep-alive 缓存中的指定路径
  function clearCacheByPath(path: string) {
    const keepAlive = keepAliveRef.value;
    if (!keepAlive) return;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const cache = (keepAlive as any).cache as Map<unknown, unknown> | undefined;
    if (!cache) return;

    for (const [cacheKey] of cache) {
      if (typeof cacheKey === 'string' && cacheKey.includes(path)) {
        cache.delete(cacheKey);
        break;
      }
    }
  }

  // 标签 key：用于 keep-alive 缓存区分和刷新
  const getTabKey = (viewRoute: { path: string }) => {
    const tab = tabs.value.find(t => t.path === viewRoute.path);
    if (tab && tab.refreshCount > 0) {
      return `${tab.refreshCount}_${viewRoute.path}`;
    }
    return viewRoute.path;
  };

  // 监听路由变化，记录已访问路径
  watch(
    () => route.path,
    (path: string) => {
      visitedPaths.value.add(path);
    },
    { immediate: true }
  );

  // 标签点击
  const handleTabClick = (index: number) => {
    const tab = tabs.value[index];
    if (tab) router.push(tab.path); // eslint-disable-line @typescript-eslint/no-unnecessary-condition
  };

  // 关闭标签：清除缓存
  const handleCloseTab = (index: number) => {
    const tab = tabs.value[index];
    if (tab) { // eslint-disable-line @typescript-eslint/no-unnecessary-condition
      clearCacheByPath(tab.path);
      visitedPaths.value.delete(tab.path);
    }
    closeTab(index);
  };

  // 刷新标签：清除缓存，key 变化会强制重建组件
  const handleRefreshTab = (index: number) => {
    const tab = tabs.value[index];
    if (tab) clearCacheByPath(tab.path); // eslint-disable-line @typescript-eslint/no-unnecessary-condition
    refreshTab(index);
  };

  // 关闭其他标签：清除不再保留的缓存
  const handleCloseOtherTabs = () => {
    const keepPaths = new Set(
      tabs.value.filter((t, i) => i === active.value || !t.closable).map(t => t.path)
    );
    for (const path of visitedPaths.value) {
      if (!keepPaths.has(path)) {
        clearCacheByPath(path);
        visitedPaths.value.delete(path);
      }
    }
    closeOtherTabs();
  };

  // 关闭所有标签：清除非默认标签的缓存
  const handleCloseAllTabs = () => {
    const defaultPaths = new Set((props.topTabs || []).map(t => t.path));
    for (const path of visitedPaths.value) {
      if (!defaultPaths.has(path)) {
        clearCacheByPath(path);
        visitedPaths.value.delete(path);
      }
    }
    closeAllTabs();
  };

  onMounted(() => {
    checkAuth();
  });
</script>

<style scoped lang="scss">
  .nk-basic-layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--nk-bg-page, #f5f5f5);

    &__body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    &__content {
      flex: 1;
      overflow: auto;
      padding: var(--nk-padding-lg, 16px);
      background: var(--nk-bg-page, #f5f5f5);
    }
  }
</style>
