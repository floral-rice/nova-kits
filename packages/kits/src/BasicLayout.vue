<template>
  <div :class="prefix()">
    <!-- 顶部导航栏 -->
    <div :class="prefix('nav')">
      <div :class="prefix('nav-left')">
        <div v-if="logo !== false" :class="prefix('nav-logo')">
          <img v-if="typeof logo === 'string'" :src="logo" alt="logo" />
          <slot v-else name="logo">
            <svg width="15" height="22" viewBox="0 0 15 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.403 10.313c.194-.163.393-.324.6-.481 1.47-1.123 2.592-2.339 3.333-3.622a7.805 7.805 0 0 0 1.101-4.036L8.427.966C8.159.657 7.906.335 7.67 0c-.26.384-.544.752-.849 1.103a15.52 15.52 0 0 1-2.336 2.165C2.853 4.514 1.67 5.858.938 7.28c.563 1.06 1.391 2.073 2.461 3.027M3.602 12.008a17.318 17.318 0 0 1-.835-.711C1.782 10.4.99 9.44.402 8.437a8.004 8.004 0 0 0 .362 5.91c.677 1.448 1.812 2.814 3.375 4.053.502.398.981.828 1.434 1.288v-.264a8.913 8.913 0 0 1 .99-4.146c-.687-1.157-1.683-2.256-2.96-3.276M11.025 12.036c-1.482 1.092-2.611 2.27-3.355 3.51a7.355 7.355 0 0 0-1.107 3.91l.008 1.173c.272.298.528.61.764.933.263-.372.549-.73.856-1.07a15.398 15.398 0 0 1 2.346-2.098c2.984-2.196 4.486-4.693 4.463-7.42a7.134 7.134 0 0 0-.489-2.537c-.802 1.278-1.971 2.484-3.486 3.597M11.353 9.828c.186.156.371.317.553.485.945-.983 1.668-2.02 2.156-3.096-.675-1.429-1.765-2.778-3.239-4.01-.496-.411-.968-.856-1.414-1.332v.268a9.617 9.617 0 0 1-.972 4.298c.68 1.201 1.661 2.34 2.917 3.387" fill="currentColor"/>
            </svg>
          </slot>
        </div>
        <div :class="prefix('nav-title')">
          {{ title }}
        </div>
      </div>

      <!-- 标签页栏 -->
      <div :class="prefix('nav-tabs')">
        <div
          v-for="(tab, index) in tabs"
          :key="tab.key"
          :class="[prefix('nav-tab'), { [prefix('nav-tab-active')]: activeTab === index }]"
          @click="handleTabClick(index)"
        >
          <span>{{ tab.title }}</span>
          <span
            v-if="tab.closable !== false"
            :class="prefix('nav-tab-close')"
            @click.stop="handleTabClose(index)"
          >
            ×
          </span>
        </div>
      </div>

      <!-- 右侧操作区 -->
      <div :class="prefix('nav-right')">
        <slot name="right" />
      </div>
    </div>

    <!-- 主体区域 -->
    <div :class="prefix('body')">
      <!-- 侧边菜单 -->
      <div :class="prefix('menu')">
        <slot name="menu">
          <BasicLayoutMenu
            :menus="filteredMenus"
            @click="handleMenuClick"
          />
        </slot>
      </div>

      <!-- 内容区域 -->
      <div :class="prefix('content')">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRequest } from '@nova-kits/hooks';
import { prefixClassName } from '@nova-kits/components';
import BasicLayoutMenu from './components/BasicLayoutMenu.vue';

const prefix = prefixClassName('kits');

export interface MenuItem {
  name: string;
  path?: string;
  children?: MenuItem[];
  icon?: string;
  authority?: string[] | string;
}

export interface TabItem {
  key: string;
  title: string;
  path: string;
  closable?: boolean;
}

export interface BasicLayoutProps {
  /** 应用左上角标题 */
  title: string;
  /** 应用左上角logo */
  logo?: string | false;
  /** 菜单配置项 */
  menus: MenuItem[];
  /** 用户包含的所有权限 */
  authorities?: string[];
  /** 置顶的路由 */
  topTabs?: { title: string; path: string }[];
  /** 水印文字 */
  waterMark?: string;
  /** 自动登录校验 */
  auth?: {
    redirectURL?: string;
    check: () => Promise<any>;
    onFail?: (err: Error) => void;
    onSuccess?: (res: any) => void;
  };
}

const props = withDefaults(defineProps<BasicLayoutProps>(), {
  logo: undefined,
  authorities: undefined,
  topTabs: undefined,
  waterMark: undefined,
  auth: undefined,
});

const router = useRouter();
const route = useRoute();

// 认证状态
const loading = ref(!!props.auth);

// 标签页状态
const tabs = ref<TabItem[]>([]);
const activeTab = ref(-1);

// 初始化默认标签页
const defaultTabs = computed(() => {
  if (props.topTabs) {
    return props.topTabs.map(tab => ({
      key: tab.path,
      title: tab.title,
      path: tab.path,
      closable: false,
    }));
  }
  return [];
});

// 权限过滤后的菜单
const filteredMenus = computed(() => {
  if (!props.authorities) {
    return props.menus;
  }

  const authSet = new Set(props.authorities);

  const filterMenu = (menus: MenuItem[]): MenuItem[] => {
    return menus.reduce<MenuItem[]>((acc, menu) => {
      // 检查权限
      if (menu.authority) {
        const hasAuth = Array.isArray(menu.authority)
          ? menu.authority.some(a => authSet.has(a))
          : authSet.has(menu.authority);

        if (!hasAuth) {
          return acc;
        }
      }

      // 递归过滤子菜单
      const filteredChildren = menu.children ? filterMenu(menu.children) : [];

      // 如果有子菜单但全部被过滤掉，且没有path，则跳过
      if (menu.children && filteredChildren.length === 0 && !menu.path) {
        return acc;
      }

      acc.push({
        ...menu,
        children: filteredChildren.length > 0 ? filteredChildren : undefined,
      });

      return acc;
    }, []);
  };

  return filterMenu(props.menus);
});

// 认证检查
const { run: checkAuth } = useRequest(
  () => {
    if (props.auth) {
      return props.auth.check();
    }
    return Promise.resolve();
  },
  {
    onSuccess(res) {
      if (props.auth?.onSuccess) {
        props.auth.onSuccess(res);
      }
      loading.value = false;
    },
    onError(err) {
      if (props.auth?.onFail) {
        props.auth.onFail(err);
      } else if (props.auth?.redirectURL) {
        const redirectURL = props.auth.redirectURL;
        const currentURL = encodeURIComponent(window.location.href);

        if (/^(?:https?):\/\//.test(redirectURL)) {
          const url = new URL(redirectURL);
          url.searchParams.set('redirect', currentURL);
          window.location.href = url.toString();
        } else {
          router.replace({
            path: redirectURL,
            query: { redirect: currentURL },
          });
        }
      }
    },
  },
);

// 监听路由变化，更新标签页
watch(
  () => route.path,
  (newPath) => {
    const existingIndex = tabs.value.findIndex(tab => tab.path === newPath);

    if (existingIndex >= 0) {
      activeTab.value = existingIndex;
    } else {
      // 查找匹配的路由配置
      const matchedMenu = findMenuByPath(props.menus, newPath);

      if (matchedMenu) {
        tabs.value.push({
          key: newPath,
          title: matchedMenu.name,
          path: newPath,
          closable: true,
        });
        activeTab.value = tabs.value.length - 1;
      }
    }
  },
  { immediate: true },
);

// 查找菜单项
function findMenuByPath(menus: MenuItem[], path: string): MenuItem | null {
  for (const menu of menus) {
    if (menu.path === path) {
      return menu;
    }
    if (menu.children) {
      const found = findMenuByPath(menu.children, path);
      if (found) return found;
    }
  }
  return null;
}

// 标签页点击
function handleTabClick(index: number) {
  if (activeTab.value !== index) {
    const tab = tabs.value[index];
    if (tab) {
      router.push(tab.path);
    }
  }
}

// 标签页关闭
function handleTabClose(index: number) {
  const newTabs = [...tabs.value];
  newTabs.splice(index, 1);

  if (index <= activeTab.value) {
    activeTab.value = Math.max(0, activeTab.value - 1);
  }

  tabs.value = newTabs;

  if (newTabs.length > 0 && newTabs[activeTab.value]) {
    router.push(newTabs[activeTab.value].path);
  }
}

// 菜单点击
function handleMenuClick(menu: MenuItem) {
  if (menu.path) {
    if (/^(?:https?):\/\//.test(menu.path)) {
      window.open(menu.path);
    } else {
      router.push(menu.path);
    }
  }
}

// 初始化
onMounted(() => {
  // 初始化默认标签页
  tabs.value = [...defaultTabs.value];

  // 执行认证检查
  if (props.auth) {
    checkAuth();
  }
});
</script>

<style scoped lang="scss">
.nova-kits {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;

  &-nav {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 $padding-md;
    background: #001529;
    color: #fff;

    &-left {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    &-logo {
      width: 32px;
      height: 32px;
      margin-right: $padding-sm;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    &-title {
      font-size: $font-lg;
      font-weight: 600;
      white-space: nowrap;
    }

    &-tabs {
      display: flex;
      align-items: center;
      flex: 1;
      margin: 0 $padding-lg;
      overflow-x: auto;
      scrollbar-width: thin;

      &::-webkit-scrollbar {
        height: 4px;
      }
    }

    &-tab {
      display: flex;
      align-items: center;
      padding: $padding-xs $padding-md;
      margin-right: $padding-xs;
      background: rgba(255, 255, 255, 0.1);
      border-radius: $padding-xs;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      &-active {
        background: rgba(255, 255, 255, 0.25);
      }

      &-close {
        margin-left: $padding-xs;
        font-size: $font-sm;
        opacity: 0.6;

        &:hover {
          opacity: 1;
        }
      }
    }

    &-right {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      margin-left: auto;
    }
  }

  &-body {
    flex: 1;
    display: flex;
    min-height: 0;
  }

  &-menu {
    width: 200px;
    flex-shrink: 0;
    background: #fff;
    border-right: 1px solid var(--el-border-color-lighter);
    overflow-y: auto;
  }

  &-content {
    flex: 1;
    min-width: 0;
    overflow: auto;
    padding: $padding-md;
  }
}
</style>
