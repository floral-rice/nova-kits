<template>
  <div class="nv-action-buttons">
    <!-- 可见按钮 -->
    <el-button
      v-for="action in visibleActions"
      :key="action.label"
      :type="action.type || 'primary'"
      link
      :disabled="isDisabled(action, row)"
      @click="action.onClick(row)"
    >
      <component :is="action.icon" v-if="action.icon" style="margin-right: 4px;" />
      {{ action.label }}
    </el-button>

    <!-- 更多下拉 -->
    <el-dropdown v-if="moreActions.length" trigger="click">
      <el-button type="primary" link>
        更多
        <el-icon class="el-icon--right">
          <ArrowDown />
        </el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="action in moreActions"
            :key="action.label"
            :disabled="isDisabled(action, row)"
            @click="action.onClick(row)"
          >
            <component :is="action.icon" v-if="action.icon" style="margin-right: 4px;" />
            {{ action.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts" generic="T">
import { ArrowDown } from '@element-plus/icons-vue';
import type { ActionConfig } from '../typing';

defineProps<{
  row: T;
  visibleActions: ActionConfig<T>[];
  moreActions: ActionConfig<T>[];
  isDisabled: (action: ActionConfig<T>, row: T) => boolean;
}>();
</script>

<style scoped lang="scss">
.nv-action-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
