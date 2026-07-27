import { computed, type ComputedRef } from 'vue';
import type { MenuItem } from '../typings';

/**
 * 判断是否拥有指定权限
 */
function hasAuthority(authority: string | string[], authorities: Set<string>): boolean {
  if (Array.isArray(authority)) {
    return authority.some((a) => authorities.has(a));
  }
  return authorities.has(authority);
}

/**
 * 递归过滤菜单树
 */
function filterMenuTree(menus: MenuItem[], authorities: Set<string>): MenuItem[] {
  return menus
    .map((menu) => {
      // 有子菜单时递归过滤
      if (menu.children && menu.children.length > 0) {
        const filteredChildren = filterMenuTree(menu.children, authorities);
        if (filteredChildren.length > 0) {
          return { ...menu, children: filteredChildren };
        }
        // 子菜单全部被过滤掉时，检查当前节点是否有 path
        return menu.path ? { ...menu, children: undefined } : null;
      }

      // 有权限限制时检查
      if (menu.authority !== undefined) {
        return hasAuthority(menu.authority, authorities) ? menu : null;
      }

      // 无权限限制，直接保留
      return menu;
    })
    .filter(Boolean) as MenuItem[];
}

/**
 * 根据权限过滤菜单
 * 无 authorities 配置时返回原菜单
 */
export default function useMenuFilter(menus: () => MenuItem[], authorities?: () => string[]): ComputedRef<MenuItem[]> {
  return computed(() => {
    const menuList = menus();
    const authList = authorities?.();

    if (!authList || authList.length === 0) {
      return menuList;
    }

    return filterMenuTree(menuList, new Set(authList));
  });
}
