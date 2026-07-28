import { ref, watch, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { TabItem } from '../typings';

const MAX_TABS = 10;

/**
 * 标签页管理 composable
 */
export default function useTabs(topTabs?: { title: string; path: string }[]): {
  tabs: Ref<TabItem[]>;
  active: Ref<number>;
  addTab: (tab: Omit<TabItem, 'refreshCount' | 'closable'>) => void;
  closeTab: (index: number) => void;
  refreshTab: (index: number) => void;
  closeOtherTabs: () => void;
  closeAllTabs: () => void;
} {
  const route = useRoute();
  const router = useRouter();

  // 初始化固定标签
  const defaultTabs: TabItem[] = (topTabs || []).map((tab) => ({
    title: tab.title,
    path: tab.path,
    closable: false,
    refreshCount: 0,
  }));

  const tabs = ref<TabItem[]>([...defaultTabs]);
  const active = ref(-1);

  // 添加标签
  const addTab = (tab: Omit<TabItem, 'refreshCount' | 'closable'>) => {
    const existingIndex = tabs.value.findIndex((t) => t.path === tab.path);

    if (existingIndex >= 0) {
      // 已存在，激活并同步标题
      tabs.value[existingIndex].title = tab.title;
      active.value = existingIndex;
    } else {
      // 新增
      tabs.value.push({
        ...tab,
        closable: true,
        refreshCount: 0,
      });

      // 超过上限时关闭最早的动态标签
      if (tabs.value.length > MAX_TABS) {
        const firstDynamicIndex = tabs.value.findIndex((t) => t.closable);
        if (firstDynamicIndex >= 0) {
          tabs.value.splice(firstDynamicIndex, 1);
        }
      }

      active.value = tabs.value.length - 1;
    }
  };

  // 关闭标签
  const closeTab = (index: number) => {
    const tab = tabs.value[index];
    if (!tab || !tab.closable) return; // eslint-disable-line @typescript-eslint/no-unnecessary-condition

    tabs.value.splice(index, 1);

    if (tabs.value.length === 0) {
      active.value = -1;
      router.push('/');
      return;
    }

    if (index <= active.value) {
      active.value = Math.max(0, active.value - 1);
    }

    const currentTab = tabs.value[active.value];
    if (currentTab && currentTab.path !== route.path) { // eslint-disable-line @typescript-eslint/no-unnecessary-condition
      router.push(currentTab.path);
    }
  };

  // 刷新标签
  const refreshTab = (index: number) => {
    const tab = tabs.value[index];
    if (!tab) return; // eslint-disable-line @typescript-eslint/no-unnecessary-condition
    tab.refreshCount += 1;
  };

  // 关闭其他标签
  const closeOtherTabs = () => {
    const currentTab = tabs.value[active.value];
    if (!currentTab) return; // eslint-disable-line @typescript-eslint/no-unnecessary-condition

    const newTabs: TabItem[] = [];
    let newActive = -1;

    tabs.value.forEach((tab, index) => {
      if (index === active.value) {
        newActive = newTabs.length;
        newTabs.push(tab);
      } else if (!tab.closable) {
        newTabs.push(tab);
        if (index < active.value) {
          newActive = newTabs.length - 1;
        }
      }
    });

    tabs.value = newTabs;
    active.value = newActive >= 0 ? newActive : 0;
  };

  // 关闭所有标签
  const closeAllTabs = () => {
    tabs.value = [...defaultTabs];
    active.value = defaultTabs.length > 0 ? 0 : -1;

    if (defaultTabs.length > 0 && defaultTabs[0].path !== route.path) {
      router.push(defaultTabs[0].path);
    } else if (defaultTabs.length === 0) {
      router.push('/');
    }
  };

  // 监听路由变化，自动新增标签
  watch(
    () => route.path,
    () => {
      const matched = route.matched;
      if (matched.length > 0) {
        const title = (route.meta.title as string) || '';
        if (!title && !route.name) return;
        addTab({ title: title || (route.name as string) || route.path, path: route.path });
      }
    },
    { immediate: true },
  );

  return { tabs, active, addTab, closeTab, refreshTab, closeOtherTabs, closeAllTabs };
}
