<script setup lang="ts">
  import { ref } from 'vue';
  import type { CustomColumn } from '../../typings';

  const props = defineProps<{
    columns: CustomColumn[];
    onAdd: (column: Omit<CustomColumn, 'id'>) => void;
    onUpdate: (id: string, updates: Partial<CustomColumn>) => void;
    onDelete: (id: string) => void;
    onSave: () => void;
    onReset: () => void;
  }>();

  const dialogVisible = ref(false);
  const editingColumn = ref<Partial<CustomColumn> | null>(null);

  // 打开添加对话框
  function openAddDialog() {
    editingColumn.value = {
      title: '',
      expression: '',
      width: 150,
      visible: true,
    };
    dialogVisible.value = true;
  }

  // 打开编辑对话框
  function openEditDialog(column: CustomColumn) {
    editingColumn.value = { ...column };
    dialogVisible.value = true;
  }

  // 保存
  function handleSave() {
    if (!editingColumn.value) return;

    if (editingColumn.value.id) {
      props.onUpdate(editingColumn.value.id, editingColumn.value);
    } else {
      props.onAdd(editingColumn.value as Omit<CustomColumn, 'id'>);
    }

    dialogVisible.value = false;
    editingColumn.value = null;
  }

  // 删除
  function handleDelete(id: string) {
    props.onDelete(id);
  }
</script>

<template>
  <div class="nv-grid__custom-panel">
    <el-button
      type="primary"
      size="small"
      @click="openAddDialog"
    >
      <el-icon><Plus /></el-icon>
      添加列
    </el-button>
    <el-button
      size="small"
      @click="onSave"
    >
      保存
    </el-button>
    <el-button
      size="small"
      @click="onReset"
    >
      重置
    </el-button>

    <!-- 列列表 -->
    <div class="nv-grid__custom-list">
      <div
        v-for="col in columns"
        :key="col.id"
        class="nv-grid__custom-item"
      >
        <span>{{ col.title }}</span>
        <span class="nv-grid__custom-expr">{{ col.expression }}</span>
        <el-button
          type="primary"
          link
          size="small"
          @click="openEditDialog(col)"
        >
          编辑
        </el-button>
        <el-button
          type="danger"
          link
          size="small"
          @click="handleDelete(col.id)"
        >
          删除
        </el-button>
      </div>
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="自定义列"
      width="500px"
    >
      <el-form
        v-if="editingColumn"
        label-width="80px"
      >
        <el-form-item label="列标题">
          <el-input v-model="editingColumn.title" />
        </el-form-item>
        <el-form-item label="表达式">
          <el-input
            v-model="editingColumn.expression"
            type="textarea"
            :rows="3"
            placeholder="例如: [price] * [quantity]"
          />
        </el-form-item>
        <el-form-item label="列宽">
          <el-input-number
            v-model="editingColumn.width"
            :min="50"
            :max="500"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="handleSave"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
  .nv-grid__custom-panel {
    padding: 8px 0;
  }

  .nv-grid__custom-list {
    margin-top: 12px;
  }

  .nv-grid__custom-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  .nv-grid__custom-expr {
    flex: 1;
    color: #909399;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
