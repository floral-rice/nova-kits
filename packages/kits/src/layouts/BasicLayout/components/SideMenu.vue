<template>
  <aside class="nk-basic-layout-menu">
    <el-scrollbar>
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
                <component :is="menu.icon" v-if="typeof menu.icon !== 'string'" />
              </el-icon>
              <span>{{ menu.name }}</span>
            </template>

            <template v-for="child in menu.children" :key="child.path || child.name">
              <!-- 二级有子菜单 -->
              <el-sub-menu v-if="child.children && child.children.length > 0" :index="child.path || child.name">
                <template #title>
                  <el-icon v-if="child.icon">
                    <component :is="child.icon" v-if="typeof child.icon !== 'string'" />
                  </el-icon>
                  <span>{{ child.name }}</span>
                </template>
                <el-menu-item
                  v-for="grandchild in child.children"
                  :key="grandchild.path || grandchild.name"
                  :index="grandchild.path"
                >
                  <el-icon v-if="grandchild.icon">
                    <component :is="grandchild.icon" v-if="typeof grandchild.icon !== 'string'" />
                  </el-icon>
                  <span>{{ grandchild.name }}</span>
                </el-menu-item>
              </el-sub-menu>

              <!-- 二级无子菜单 -->
              <el-menu-item v-else :index="child.path">
                <el-icon v-if="child.icon">
                  <component :is="child.icon" v-if="typeof child.icon !== 'string'" />
                </el-icon>
                <span>{{ child.name }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>

          <!-- 无子菜单 -->
          <el-menu-item v-else :index="menu.path">
            <el-icon v-if="menu.icon">
              <component :is="menu.icon" v-if="typeof menu.icon !== 'string'" />
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
import type { MenuItem } from '../typings';

const props = defineProps<{
  menus: MenuItem[];
  defaultActive?: string;
  collapse?: boolean;
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
  background: #fff;
  border-right: 1px solid #e8e8e8;
  flex-shrink: 0;
  transition: width 0.3s;

  &__inner {
    border-right: none;
    height: 100%;
  }
}
</style>
