import type { ClassValue, StyleValue } from 'vue';

export interface LayoutProps {
  defaultSidebarWidth?: number;
  collapsed?: boolean;
  activeKey?: string;
  class?: ClassValue;
  style?: StyleValue;
}

export interface Tab {
  label?: string;
  key: string;
}

export interface LayoutTabsProps {
  tabs?: Tab[];
  activeKey?: string;
  defaultSidebarWidth?: number;
  collapsed?: boolean;
  class?: ClassValue;
  style?: StyleValue;
}

export interface LayoutContentProps {
  defaultSidebarWidth?: number;
  collapsed?: boolean;
  containerWidth?: number;
}

export interface LayoutPortalProps {
  to: 'header' | 'footer';
}
