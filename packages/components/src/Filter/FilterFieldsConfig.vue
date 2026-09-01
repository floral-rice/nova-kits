<template>
  <el-popover
    placement="bottom-end"
    :width="280"
    trigger="click"
    @show="handleShow"
  >
    <template #reference>
      <el-button :icon="Setting" />
    </template>

    <!-- 搜索框 -->
    <el-input
      v-model="searchKeyword"
      placeholder="搜索选项"
      clearable
      :prefix-icon="Search"
      class="nv-filter-fields__search"
    />

    <!-- 可拖拽列表 -->
    <div class="nv-filter-fields__list">
      <div
        v-for="item in filteredItems"
        :key="item.key"
        class="nv-filter-fields__item"
        :class="{
          'nv-filter-fields__item--drag-over-top':
            dragOverItem?.key === item.key && dragOverPosition === 'top',
          'nv-filter-fields__item--drag-over-bottom':
            dragOverItem?.key === item.key && dragOverPosition === 'bottom',
        }"
        draggable="true"
        @dragstart="handleDragStart($event, item)"
        @dragover="handleDragOver($event, item)"
        @dragleave="handleDragLeave"
        @drop="handleDrop($event, item)"
        @dragend="handleDragEnd"
      >
        <el-checkbox
          :model-value="!item.hidden"
          :disabled="item.lockVisible"
          @change="(val: boolean) => handleHiddenChange(item, !val)"
        />
        <span class="nv-filter-fields__item-label">{{ item.label }}</span>
      </div>
      <el-empty
        v-if="filteredItems.length === 0"
        :image-size="60"
        description="暂无数据"
      />
    </div>

    <!-- 底部按钮 -->
    <div class="nv-filter-fields__footer">
      <el-button
        size="small"
        @click="handleReset"
      >
        重置
      </el-button>
      <el-button
        size="small"
        @click="handleCancel"
      >
        取消
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="handleSave"
      >
        保存
      </el-button>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { Setting, Search } from '@element-plus/icons-vue';
  import { ElMessage, ElInput, ElPopover, ElButton, ElCheckbox, ElEmpty } from 'element-plus';
  import type { FilterItemType } from './types';

  interface FieldItem {
    key: string;
    label?: string;
    hidden: boolean;
    lockVisible?: boolean;
    hiddenInFields?: boolean;
  }

  const props = defineProps<{
    originData: FilterItemType[];
    value: FieldItem[];
  }>();

  const emit = defineEmits<{
    change: [value: FieldItem[]];
    save: [];
  }>();

  const searchKeyword = ref('');
  const prevValue = ref<FieldItem[]>([]);

  // 拖拽状态
  const dragItem = ref<FieldItem | null>(null);
  const dragOverItem = ref<FieldItem | null>(null);
  const dragOverPosition = ref<'top' | 'bottom' | null>(null);

  // 过滤后的项目
  const filteredItems = computed(() => {
    const keyword = searchKeyword.value.trim();
    return props.value.filter(item => {
      if (!item.label || item.hiddenInFields) return false;
      if (keyword && !item.label.includes(keyword)) return false;
      return true;
    });
  });

  // 显示时保存当前值
  const handleShow = () => {
    prevValue.value = props.value.map(item => ({ ...item }));
  };

  // 隐藏状态变化
  const handleHiddenChange = (item: FieldItem, hidden: boolean) => {
    const newValue = [...props.value];
    const index = newValue.findIndex(v => v.key === item.key);
    if (index !== -1) {
      newValue[index] = { ...newValue[index], hidden };
      const visibleCount = newValue
        .filter(v => !v.hiddenInFields)
        .reduce((prev, item) => prev + (item.hidden ? 0 : 1), 0);
      if (visibleCount) {
        emit('change', newValue);
      } else {
        ElMessage.warning('请至少保留一个筛选项');
      }
    }
  };

  // 拖拽开始
  const handleDragStart = (e: DragEvent, item: FieldItem) => {
    dragItem.value = item;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  // 拖拽经过
  const handleDragOver = (e: DragEvent, item: FieldItem) => {
    e.preventDefault();
    if (dragItem.value && dragItem.value.key !== item.key) {
      dragOverItem.value = item;
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      dragOverPosition.value = e.clientY < midY ? 'top' : 'bottom';
    }
  };

  // 拖拽离开
  const handleDragLeave = () => {
    dragOverItem.value = null;
    dragOverPosition.value = null;
  };

  // 拖拽放下
  const handleDrop = (e: DragEvent, targetItem: FieldItem) => {
    e.preventDefault();
    if (!dragItem.value || dragItem.value.key === targetItem.key) return;

    const newValue = [...props.value];
    const dragIndex = newValue.findIndex(v => v.key === dragItem.value!.key);
    const targetIndex = newValue.findIndex(v => v.key === targetItem.key);

    if (dragIndex === -1 || targetIndex === -1) return;

    // 移除拖拽项
    const [removed] = newValue.splice(dragIndex, 1);
    // 插入到目标位置（向下拖拽时，splice移除导致目标索引左移一位，需修正）
    const adjustedTarget = dragIndex < targetIndex ? targetIndex - 1 : targetIndex;
    const insertIndex = dragOverPosition.value === 'top' ? adjustedTarget : adjustedTarget + 1;
    newValue.splice(insertIndex, 0, removed);

    emit('change', newValue);
  };

  // 拖拽结束
  const handleDragEnd = () => {
    dragItem.value = null;
    dragOverItem.value = null;
    dragOverPosition.value = null;
  };

  // 重置
  const handleReset = () => {
    const newValue = props.originData.map(item => ({
      key: item.key,
      label: item.label,
      hidden: !!item.defaultHidden,
      lockVisible: item.lockVisible,
      hiddenInFields: false,
    }));
    emit('change', newValue);
  };

  // 取消
  const handleCancel = () => {
    emit('change', prevValue.value);
  };

  // 保存
  const handleSave = () => {
    emit('save');
  };
</script>

<style scoped lang="scss">
  .nv-filter-fields {
    &__search {
      margin-bottom: var(--nk-padding-sm);
    }

    &__list {
      max-height: 400px;
      overflow-y: auto;
      margin: var(--nk-padding-sm) 0;
    }

    &__item {
      display: flex;
      align-items: center;
      gap: var(--nk-padding-sm);
      padding: var(--nk-padding-sm);
      cursor: move;
      border-radius: 4px;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f5f7fa;
      }

      &--drag-over-top {
        box-shadow: 0 -2px 0 var(--el-color-primary);
      }

      &--drag-over-bottom {
        box-shadow: 0 2px 0 var(--el-color-primary);
      }

      &-label {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    &__footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--nk-padding-sm);
      padding-top: var(--nk-padding-sm);
      border-top: 1px solid #ebeef5;
    }
  }
</style>
