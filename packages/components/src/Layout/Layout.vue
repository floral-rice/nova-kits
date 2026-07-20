<template>
  <div
    v-loading="loading"
    :class="[prefix(), props.class]"
    :style="style"
    element-loading-background="rgba(255, 255, 255, 0.5)"
  >
    <LayoutContent :v-slot="$slots" />
  </div>
</template>

<script setup lang="ts">
import { ClassValue, StyleValue } from 'vue';
import { prefixClassName } from '../utils';
import { ElLoading } from 'element-plus';
const vLoading = ElLoading.directive;
import LayoutContent from './components/LayoutContent/index.vue';

export interface LayoutProps {
  /** 页面loading状态 */
  loading?: boolean;
  class?: ClassValue;
  style?: StyleValue;
}

const prefix = prefixClassName('layout');

const props = withDefaults(defineProps<LayoutProps>(), {
  loading: false,
  class: undefined,
  style: undefined,
});
</script>

<style scoped lang="scss">
.nova-layout {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  background: #fff;
}
</style>
