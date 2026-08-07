import type { GridApi, CellValueChangedEvent } from 'ag-grid-community';
import type { DataGridProps, DataGridEmits, ColType } from '../typings';
import TextEditor from '../cell-editors/TextEditor.vue';
import NumberEditor from '../cell-editors/NumberEditor.vue';
import DateEditor from '../cell-editors/DateEditor.vue';
import SelectEditor from '../cell-editors/SelectEditor.vue';

// 编辑器映射
const EDITOR_MAP: Record<string, any> = {
  text: TextEditor,
  number: NumberEditor,
  date: DateEditor,
  select: SelectEditor,
};

export function useCellEdit<TData extends Record<string, any>>(
  props: DataGridProps<TData>,
  gridApi: () => GridApi<TData> | null,
  emit: DataGridEmits<TData>
) {
  // 获取编辑器组件
  function getEditorComponent(colDef: ColType<TData>) {
    if (!colDef.editable) return null;

    const renderer = colDef.editable.renderer;
    if (typeof renderer === 'function') {
      return renderer;
    }

    return EDITOR_MAP[renderer] || null;
  }

  // 判断是否可编辑
  function isEditable(colDef: ColType<TData>, data: TData, rowIndex: number): boolean {
    if (!colDef.editable) return false;

    if (typeof colDef.editable.enable === 'function') {
      return colDef.editable.enable({ data, colDef, rowIndex });
    }

    return true;
  }

  // 值变化处理
  function onCellValueChanged(event: CellValueChangedEvent<TData>) {
    const colDef = event.colDef as ColType<TData>;

    if (colDef.editable?.valueSetter) {
      const updates = colDef.editable.valueSetter(event.newValue, event.data);
      Object.assign(event.data, updates);
    }

    emit('cell-value-change', event.data, colDef, event.newValue, event.oldValue);
  }

  return {
    getEditorComponent,
    isEditable,
    onCellValueChanged,
  };
}
