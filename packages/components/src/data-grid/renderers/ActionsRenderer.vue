<script setup lang="ts">
  import { computed } from 'vue';
  import { ElMessageBox } from 'element-plus';
  import type { ICellRendererParams } from 'ag-grid-community';
  import type { RowActionsType, RowActionType } from '../typings';
  import { isSummaryRow } from '../constants';

  const props = defineProps<{
    params: ICellRendererParams;
    config: RowActionsType<any>;
  }>();

  const data = props.params.data;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const rowIndex = props.params.node?.rowIndex ?? 0;

  // 是否是汇总行
  const isSummary = computed(() => isSummaryRow(props.params));

  // 可见操作
  const visibleActions = computed(() => {
    if (isSummary.value) return [];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const actions = props.config.actions || [];
    const maxVisible = props.config.maxVisible ?? 3;

    return actions.slice(0, maxVisible);
  });

  // 下拉操作
  const dropdownActions = computed(() => {
    if (isSummary.value) return [];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const actions = props.config.actions || [];
    const maxVisible = props.config.maxVisible ?? 3;

    return actions.slice(maxVisible);
  });

  // 获取标签
  function getLabel(action: RowActionType<any>): string {
    return typeof action.label === 'function' ? action.label(data) : action.label;
  }

  // 判断是否禁用
  function isDisabled(action: RowActionType<any>): boolean {
    return action.disabled ? action.disabled(data) : false;
  }

  // 点击操作
  async function handleClick(action: RowActionType<any>) {
    if (isDisabled(action)) return;

    // 确认对话框
    if (action.confirm) {
      const message = typeof action.confirm === 'function' ? action.confirm(data) : action.confirm;
      try {
        await ElMessageBox.confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
      } catch {
        return;
      }
    }

    action.onClick(data, rowIndex);
  }
</script>

<template>
  <div
    v-if="!isSummary"
    class="nv-grid__actions"
  >
    <!-- 可见操作 -->
    <el-button
      v-for="action in visibleActions"
      :key="getLabel(action)"
      :type="action.danger ? 'danger' : 'primary'"
      :disabled="isDisabled(action)"
      link
      size="small"
      @click="handleClick(action)"
    >
      <el-icon v-if="action.icon">
        <component :is="action.icon" />
      </el-icon>
      {{ getLabel(action) }}
    </el-button>

    <!-- 下拉操作 -->
    <el-dropdown v-if="dropdownActions.length > 0">
      <el-button
        type="primary"
        link
        size="small"
      >
        更多
        <el-icon><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="action in dropdownActions"
            :key="getLabel(action)"
            :disabled="isDisabled(action)"
            @click="handleClick(action)"
          >
            <el-icon v-if="action.icon">
              <component :is="action.icon" />
            </el-icon>
            {{ getLabel(action) }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
