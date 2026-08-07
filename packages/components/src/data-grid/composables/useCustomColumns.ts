import { ref, computed, onMounted } from 'vue';
import type { GridApi } from 'ag-grid-community';
import type { DataGridProps, CustomColumn, CustomColumnData } from '../typings';

export function useCustomColumns<TData extends Record<string, any>>(
  props: DataGridProps<TData>,
  _gridApi: () => GridApi<TData> | null
) {
  const customColumns = ref<CustomColumn[]>([]);
  const columnOrder = ref<string[]>([]);

  // 加载存储的自定义列
  async function loadCustomColumns() {
    if (!props.customColumnPanelStorage) return;

    const data = await props.customColumnPanelStorage.get();
    if (data) {
      customColumns.value = data.columns;
      columnOrder.value = data.order;
    }
  }

  // 保存自定义列
  async function saveCustomColumns() {
    if (!props.customColumnPanelStorage) return;

    const data: CustomColumnData = {
      columns: customColumns.value,
      order: columnOrder.value,
    };

    await props.customColumnPanelStorage.set(data);
  }

  // 添加自定义列
  function addColumn(column: Omit<CustomColumn, 'id'>): CustomColumn {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const newColumn: CustomColumn = {
      ...column,
      id,
      visible: true,
    };

    customColumns.value.push(newColumn);
    columnOrder.value.push(newColumn.id);

    return newColumn;
  }

  // 更新自定义列
  function updateColumn(id: string, updates: Partial<CustomColumn>) {
    const index = customColumns.value.findIndex(col => col.id === id);
    if (index !== -1) {
      customColumns.value[index] = { ...customColumns.value[index], ...updates };
    }
  }

  // 删除自定义列
  function deleteColumn(id: string) {
    customColumns.value = customColumns.value.filter(col => col.id !== id);
    columnOrder.value = columnOrder.value.filter(colId => colId !== id);
  }

  // 设置列顺序
  function setColumnOrder(order: string[]) {
    columnOrder.value = order;
  }

  // 重置自定义列
  function resetColumns() {
    customColumns.value = [];
    columnOrder.value = [];
  }

  // 获取自定义列的值
  function getCustomColumnValue(column: CustomColumn, data: TData): any {
    try {
      // 简单的表达式解析
      const fields = (props.columns || [])
        .map((col: any) => col.dataIndex)
        .filter(Boolean) as string[];

      const values: Record<string, any> = {};
      fields.forEach(field => {
        values[field] = data[field];
      });

      // 替换字段引用
      const processedExpr = column.expression.replace(/\[([^\]]+)\]/g, (match, field) => {
        const value = values[field];
        if (value === undefined || value === null) return '0';
        return String(value);
      });

      // 使用 Function 构造函数求值（安全风险较低，因为是用户自定义）
      return new Function(`return ${processedExpr}`)();
    } catch {
      return null;
    }
  }

  // 构建自定义列定义
  const customColumnDefs = computed(() => {
    return customColumns.value
      .filter(col => col.visible !== false)
      .map(col => ({
        colId: `custom_${col.id}`,
        headerName: col.title,
        width: col.width || 150,
        valueGetter: (params: any) => {
          return getCustomColumnValue(col, params.data);
        },
        editable: false,
      }));
  });

  // 初始化
  onMounted(() => {
    loadCustomColumns();
  });

  return {
    customColumns,
    columnOrder,
    customColumnDefs,
    addColumn,
    updateColumn,
    deleteColumn,
    setColumnOrder,
    resetColumns,
    saveCustomColumns,
    loadCustomColumns,
  };
}
