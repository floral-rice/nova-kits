import type { Component } from 'vue';

export interface MenuItem {
  /** 菜单名称 */
  name: string;
  /** 路由路径，外部链接以 http/https 开头 */
  path?: string;
  /** 图标，字符串为 icon 名称，组件为自定义渲染 */
  icon?: string | Component;
  /** 子菜单，最多支持三级 */
  children?: MenuItem[];
  /** 权限标识，字符串或字符串数组 */
  authority?: string | string[];
}

export interface TabItem {
  /** 标签标题 */
  title: string;
  /** 路由路径 */
  path: string;
  /** 是否可关闭，固定标签为 false */
  closable: boolean;
  /** 刷新计数，用于触发 router-view 重新渲染 */
  refreshCount: number;
}

export interface BasicLayoutProps {
  /** 标题 */
  title: string;
  /** logo，字符串为图片路径，false 隐藏，组件为自定义渲染 */
  logo?: string | false | Component;
  /** 菜单数据，最多支持三级 */
  menus: MenuItem[];
  /** 用户权限列表，用于菜单过滤 */
  authorities?: string[];
  /** 固定标签页（如首页），不可关闭 */
  topTabs?: { title: string; path: string }[];
  /** 鉴权配置 */
  auth?: {
    /** 鉴权失败时的重定向地址 */
    redirectURL?: string;
    /** 鉴权校验函数 */
    check: () => Promise<any>;
    /** 鉴权成功回调 */
    onSuccess?: (res: any) => void;
    /** 鉴权失败回调 */
    onFail?: (err: Error) => void;
  };
}
