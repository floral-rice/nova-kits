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
      // 已存在，激活
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- array index access can return undefined at runtime
    if (!tab || !tab.closable) return;

    tabs.value.splice(index, 1);

    // 调整激活索引
    if (index <= active.value) {
      active.value = Math.max(0, active.value - 1);
    }

    // 导航到当前激活的标签
    const currentTab = tabs.value[active.value];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- array index access can return undefined at runtime
    if (currentTab && currentTab.path !== route.path) {
      router.push(currentTab.path);
    }
  };

  // 刷新标签
  const refreshTab = (index: number) => {
    const tab = tabs.value[index];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- array index access can return undefined at runtime
    if (!tab) return;
    tab.refreshCount += 1;
  };

  // 关闭其他标签
  const closeOtherTabs = () => {
    const currentTab = tabs.value[active.value];
    tabs.value = [
      ...defaultTabs,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- array index access can return undefined at runtime
      ...(currentTab && currentTab.closable ? [currentTab] : []),
    ];
    active.value = tabs.value.length - 1;
  };

  // 关闭所有标签
  const closeAllTabs = () => {
    tabs.value = [...defaultTabs];
    active.value = defaultTabs.length > 0 ? 0 : -1;

    if (defaultTabs.length > 0 && defaultTabs[0].path !== route.path) {
      router.push(defaultTabs[0].path);
    }
  };

  // 监听路由变化，自动新增标签
  watch(
    () => route.path,
    () => {
      const matched = route.matched;
      if (matched.length > 0) {
        const title = (route.meta.title as string) || '';
        addTab({ title, path: route.path });
      }
    },
    { immediate: true },
  );

  return { tabs, active, addTab, closeTab, refreshTab, closeOtherTabs, closeAllTabs };
}
