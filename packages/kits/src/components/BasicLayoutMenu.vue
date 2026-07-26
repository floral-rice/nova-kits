<template>
  <div :class="prefix('menu')">
    <div
      v-for="menu in menus"
      :key="menu.name"
      :class="prefix('menu-item')"
    >
      <div
        :class="[prefix('menu-item-title'), { [prefix('menu-item-active')]: isActive(menu) }]"
        @click="handleClick(menu)"
      >
        <span v-if="menu.icon" :class="prefix('menu-item-icon')">
          {{ menu.icon }}
        </span>
        <span :class="prefix('menu-item-name')">{{ menu.name }}</span>
        <span
          v-if="menu.children"
          :class="[prefix('menu-item-arrow'), { [prefix('menu-item-arrow-expanded')]: isExpanded(menu) }]"
        >
          ▶
        </span>
      </div>
      <div
        v-if="menu.children && isExpanded(menu)"
        :class="prefix('menu-item-children')"
      >
        <BasicLayoutMenu
          :menus="menu.children"
          :level="level + 1"
          @click="$emit('click', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { prefixClassName } from '@nova-kits/components';

const prefix = prefixClassName('kits');

interface MenuItem {
  name: string;
  path?: string;
  children?: MenuItem[];
  icon?: string;
}

const props = withDefaults(defineProps<{
  menus: MenuItem[];
  level?: number;
}>(), {
  level: 0,
});

const emit = defineEmits<{
  click: [menu: MenuItem];
}>();

const route = useRoute();
const expandedMenus = ref<Set<string>>(new Set());

// 判断菜单是否激活
function isActive(menu: MenuItem): boolean {
  return menu.path === route.path;
}

// 判断菜单是否展开
function isExpanded(menu: MenuItem): boolean {
  return expandedMenus.value.has(menu.name);
}

// 切换展开/折叠
function toggleExpand(menu: MenuItem) {
  if (expandedMenus.value.has(menu.name)) {
    expandedMenus.value.delete(menu.name);
  } else {
    expandedMenus.value.add(menu.name);
  }
}

// 点击菜单
function handleClick(menu: MenuItem) {
  if (menu.children) {
    toggleExpand(menu);
  } else {
    emit('click', menu);
  }
}
</script>

<style scoped lang="scss">
.nova-kits-menu {
  &-item {
    &-title {
      display: flex;
      align-items: center;
      padding: $padding-sm $padding-md;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: var(--el-fill-color-light);
      }
    }

    &-active {
      background: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
    }

    &-icon {
      margin-right: $padding-sm;
      font-size: $font-lg;
    }

    &-name {
      flex: 1;
      font-size: $font-md;
    }

    &-arrow {
      font-size: 10px;
      transition: transform 0.2s;

      &-expanded {
        transform: rotate(90deg);
      }
    }

    &-children {
      padding-left: $padding-lg;
    }
  }
}
</style>
