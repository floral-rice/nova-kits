<template>
  <header class="nk-basic-layout-nav">
    <div class="nk-basic-layout-nav__left">
      <div v-if="logo !== false" class="nk-basic-layout-nav__logo">
        <img v-if="typeof logo === 'string'" :src="logo" alt="logo">
        <component :is="logo" v-else-if="logo" />
      </div>
      <div class="nk-basic-layout-nav__title">
        {{ title }}
      </div>
    </div>

    <TabBar
      :tabs="tabs"
      :active="active"
      @click="$emit('tabClick', $event)"
      @close="$emit('tabClose', $event)"
      @refresh="$emit('tabRefresh', $event)"
      @close-other="$emit('tabCloseOther')"
      @close-all="$emit('tabCloseAll')"
    />

    <div class="nk-basic-layout-nav__right">
      <slot name="right" />
    </div>
  </header>
</template>

<script setup lang="ts">
import TabBar from './TabBar.vue';
import type { TabItem } from '../typings';
import type { Component } from 'vue';

defineProps<{
  title: string;
  logo?: string | false | Component;
  tabs: TabItem[];
  active: number;
}>();

defineEmits<{
  tabClick: [index: number];
  tabClose: [index: number];
  tabRefresh: [index: number];
  tabCloseOther: [];
  tabCloseAll: [];
}>();
</script>

<style scoped lang="scss">
.nk-basic-layout-nav {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 var(--nk-padding-lg, 16px);
  background: var(--nk-bg-header, #fff);
  border-bottom: 1px solid var(--nk-border-color, #e8e8e8);
  flex-shrink: 0;

  &__left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  &__logo {
    display: flex;
    align-items: center;

    img {
      height: 28px;
      width: auto;
    }
  }

  &__title {
    font-size: var(--nk-font-lg, 16px);
    font-weight: 600;
    color: var(--nk-text-primary, #333);
    white-space: nowrap;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
    margin-left: 12px;
  }
}
</style>
