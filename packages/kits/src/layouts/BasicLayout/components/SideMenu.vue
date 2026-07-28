<template>
  <aside :class="['nk-basic-layout-menu', { 'nk-basic-layout-menu--collapsed': collapse }]">
    <el-scrollbar wrap-class="nk-basic-layout-menu__scroll-wrap">
      <div class="nk-basic-layout-menu__toggle" @click="$emit('update:collapse', !collapse)">
        <el-icon>
          <Fold v-if="!collapse" />
          <Expand v-else />
        </el-icon>
      </div>
      <el-menu
        :default-active="defaultActive"
        :collapse="collapse"
        class="nk-basic-layout-menu__inner"
        @select="handleSelect"
      >
        <template v-for="menu in menus" :key="menu.path || menu.name">
          <!-- 有子菜单 -->
          <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.path || menu.name">
            <template #title>
              <el-icon v-if="menu.icon">
                <component :is="menu.icon" />
              </el-icon>
              <span>{{ menu.name }}</span>
            </template>

            <template v-for="child in menu.children" :key="child.path || child.name">
              <!-- 二级有子菜单 -->
              <el-sub-menu v-if="child.children && child.children.length > 0" :index="child.path || child.name">
                <template #title>
                  <el-icon v-if="child.icon">
                    <component :is="child.icon" />
                  </el-icon>
                  <span>{{ child.name }}</span>
                </template>
                <el-menu-item
                  v-for="grandchild in child.children"
                  :key="grandchild.path || grandchild.name"
                  :index="grandchild.path"
                >
                  <el-icon v-if="grandchild.icon">
                    <component :is="grandchild.icon" />
                  </el-icon>
                  <span>{{ grandchild.name }}</span>
                </el-menu-item>
              </el-sub-menu>

              <!-- 二级无子菜单 -->
              <el-menu-item v-else :index="child.path">
                <el-icon v-if="child.icon">
                  <component :is="child.icon" />
                </el-icon>
                <span>{{ child.name }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>

          <!-- 无子菜单 -->
          <el-menu-item v-else :index="menu.path">
            <el-icon v-if="menu.icon">
              <component :is="menu.icon" />
            </el-icon>
            <template #title>
              {{ menu.name }}
            </template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </aside>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Fold, Expand } from '@element-plus/icons-vue';
import type { MenuItem } from '../typings';

defineProps<{
  menus: MenuItem[];
  defaultActive?: string;
  collapse?: boolean;
}>();

defineEmits<{
  'update:collapse': [value: boolean];
}>();

const router = useRouter();

const handleSelect = (index: string) => {
  if (/^(?:https?:)?\/\//.test(index)) {
    window.open(index);
  } else {
    router.push(index);
  }
};
</script>

<style scoped lang="scss">
.nk-basic-layout-menu {
  width: 220px;
  height: 100%;
  overflow: hidden;
  background: var(--nk-bg-menu, #fff);
  border-right: 1px solid var(--nk-border-color, #e8e8e8);
  flex-shrink: 0;
  transition: width 0.3s;

  &--collapsed {
    width: 64px;
  }

  :deep(.el-scrollbar) {
    height: 100%;
  }

  :deep(.nk-basic-layout-menu__scroll-wrap) {
    overflow-x: hidden;
  }

  &__toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    cursor: pointer;
    color: var(--nk-text-secondary, #666);
    border-bottom: 1px solid var(--nk-border-color, #e8e8e8);
    transition: background 0.2s, color 0.2s;

    &:hover {
      background: var(--nk-bg-hover, #f5f5f5);
      color: var(--nk-color-primary, #409eff);
    }
  }

  &__inner {
    border-right: none;
    height: calc(100% - 40px);
    padding: 0 8px;
    box-sizing: border-box;

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      padding-left: 12px !important;
      padding-right: 12px !important;
      margin: 1px 0;
      border-radius: 4px;
      height: 40px;
      line-height: 40px;

      > span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    // 折叠状态下居中图标
    &.el-menu--collapse {
      padding: 0;

      :deep(.el-menu-item),
      :deep(.el-sub-menu__title) {
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin: 1px 0;
        border-radius: 4px;
        height: 40px;
        line-height: 40px;
        text-align: center;
      }
    }
  }
}
</style>
