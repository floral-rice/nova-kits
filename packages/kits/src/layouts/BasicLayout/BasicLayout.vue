<template>
  <div v-loading="authLoading" class="nk-basic-layout">
    <NavHeader
      :title="title"
      :logo="logo"
      :tabs="tabs"
      :active="active"
      @tab-click="handleTabClick"
      @tab-close="closeTab"
      @tab-refresh="refreshTab"
      @tab-close-other="closeOtherTabs"
      @tab-close-all="closeAllTabs"
    >
      <template #right>
        <slot name="right" />
      </template>
    </NavHeader>

    <div class="nk-basic-layout__body">
      <SideMenu
        :menus="filteredMenus"
        :default-active="route.path"
      />

      <div class="nk-basic-layout__content">
        <slot>
          <router-view v-slot="{ Component: RouteComponent, route: viewRoute }">
            <keep-alive>
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
import { onMounted } from 'vue';
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
const { tabs, active, closeTab, refreshTab, closeOtherTabs, closeAllTabs } = useTabs(props.topTabs);

// 菜单过滤
const filteredMenus = useMenuFilter(
  () => props.menus,
  () => (props.authorities ?? []),
);

// 标签点击
const handleTabClick = (index: number) => {
  const tab = tabs.value[index];
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (tab) {
    router.push(tab.path);
  }
};

// 获取标签 key（用于刷新）
const getTabKey = (viewRoute: { path: string }) => {
  const tab = tabs.value.find((t) => t.path === viewRoute.path);
  if (tab && tab.refreshCount > 0) {
    return `${tab.refreshCount}_${viewRoute.path}`;
  }
  return viewRoute.path;
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
  background: #f5f5f5;

  &__body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  &__content {
    flex: 1;
    overflow: auto;
    padding: $padding-lg;
    background: #f5f5f5;
  }
}
</style>
