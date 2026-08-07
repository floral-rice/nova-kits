<script setup lang="ts" generic="TData extends Record<string, any>">
  import { computed, provide } from 'vue';
  import { AgGridVue } from 'ag-grid-vue3';
  import type {
    DataGridProps,
    DataGridEmits,
    DataGridExposed,
    ColType,
    ColGroupType,
  } from './typings';
  import { useGridState } from './composables/useGridState';
  import { useSelection } from './composables/useSelection';
  import { usePagination } from './composables/usePagination';
  import { useRemoteData } from './composables/useRemoteData';
  import { useCellEdit } from './composables/useCellEdit';
  import { useValidation } from './composables/useValidation';
  import { useCustomColumns } from './composables/useCustomColumns';
  import { useSearch } from './composables/useSearch';
  import { useSummary } from './composables/useSummary';
  import { useDetailCell } from './composables/useDetailCell';
  import { provideGridContext } from './composables/useGridContext';

  // 导入渲染器
  import CellRenderer from './renderers/CellRenderer.vue';
  import HeaderRenderer from './renderers/HeaderRenderer.vue';
  import ActionsRenderer from './renderers/ActionsRenderer.vue';
  import CellIndexRenderer from './renderers/CellIndexRenderer.vue';

  // 导入组件
  import GridSearch from './components/GridSearch.vue';
  import GridSelected from './components/GridSelected.vue';
  import GridPagination from './components/GridPagination.vue';
  import CustomColumnPanel from './components/custom-panel/CustomColumnPanel.vue';

  // 导入常量
  import { DataGridIndexColId } from './constants';

  // 导入样式
  import './index.scss';

  const props = withDefaults(defineProps<DataGridProps<TData>>(), {
    loading: false,
    emptyText: '暂无数据',
    autoLoad: true,
    enableEstimateInitialColumnWidth: true,
    showIndex: false,
    domLayout: 'normal',
  });

  const emit = defineEmits<DataGridEmits<TData>>();

  // 组合 composables
  const { gridApi, onGridReady } = useGridState<TData>(props);
  const { selectedRowKeys, onSelectionChanged, deselectAll } = useSelection(
    props,
    () => gridApi.value
  );
  const pagination = usePagination(props, () => gridApi.value);
  const remote = useRemoteData(props, () => gridApi.value, pagination);
  const edit = useCellEdit(props, () => gridApi.value, emit);
  const validation = useValidation(props, () => gridApi.value);
  const customCols = useCustomColumns(props, () => gridApi.value);
  const search = useSearch(props, () => gridApi.value);

  // 获取当前数据
  const currentData = computed(() => {
    if (props.fetch) {
      return remote.data.value;
    }
    return props.dataSource || [];
  });

  const _summary = useSummary(
    props,
    () => gridApi.value,
    () => currentData.value as TData[]
  );

  const detailCell = useDetailCell(props, () => gridApi.value);

  // provide 校验上下文
  provide('validation', validation);

  // provide grid context
  provideGridContext({
    gridApi,
    errors: validation.errors,
  });

  // 判断是否列分组
  function isColGroup<TData>(
    col: ColType<TData> | ColGroupType<TData>
  ): col is ColGroupType<TData> {
    return 'children' in col && Array.isArray((col as any).children);
  }

  // 默认列定义
  const defaultColDef = {
    resizable: true,
    initialWidth: 140,
    suppressMenu: true,
  };

  // 获取列的 field
  function getColField(col: any): string | undefined {
    return (
      col.field ||
      col.key ||
      (Array.isArray(col.dataIndex) ? col.dataIndex.join('.') : col.dataIndex) ||
      col.colId
    );
  }

  // 转换列定义为 AG Grid 格式
  function convertToAgGridCols(cols: any[]): any[] {
    return cols.map(col => {
      if (isColGroup(col)) {
        return {
          headerName: col.headerName,
          marryChildren: col.marryChildren,
          openByDefault: col.openByDefault,
          groupId: col.groupId,
          children: convertToAgGridCols(col.children),
        };
      }

      // 解构提取自定义属性，避免传给 AG Grid
      const { title, dataIndex: _dataIndex, render, ellipsis, sorter, editable, className, ...rest } = col;

      const field = getColField(col);
      const opts: any = { ...rest };

      // 映射 field
      if (field !== undefined) {
        opts.field = field;
      }

      // 映射 title -> headerName
      if (typeof title === 'string') {
        opts.headerName = title;
      } else if (typeof title === 'object' || typeof title === 'function') {
        opts.headerComponentParams = {
          ...opts.headerComponentParams,
          title,
        };
      }

      // className -> cellClass
      if (className) {
        opts.cellClass = className;
      }

      // ellipsis
      if (ellipsis === false) {
        opts.wrapText = true;
        opts.autoHeight = true;
      }

      // sorter
      if (typeof sorter === 'function') {
        opts.sortable = true;
        opts.comparator = (valA: any, valB: any, nodeA: any, nodeB: any) => {
          return sorter(nodeA.data, nodeB.data);
        };
      } else if (sorter !== undefined) {
        opts.sortable = sorter;
      }

      // render -> cellRenderer
      opts.headerComponent = HeaderRenderer;
      opts.cellRenderer = CellRenderer;
      if (render) {
        opts.cellRendererParams = {
          ...opts.cellRendererParams,
          render,
        };
      }

      // editable
      if (typeof editable === 'object') {
        opts.editable = (params: any) => edit.isEditable(col, params.data, params.rowIndex);
        opts.cellEditor = edit.getEditorComponent(col);
        opts.cellEditorParams = editable.params || {};
      } else {
        opts.editable = editable;
      }

      return opts;
    });
  }

  // 构建列定义
  function buildColumnDefs() {
    const cols = props.columns || [];
    const result: any[] = [];

    // 序号列
    if (props.showIndex) {
      result.push({
        colId: DataGridIndexColId,
        headerName: '#',
        width: 60,
        pinned: 'left',
        cellRenderer: CellIndexRenderer,
        suppressMenu: true,
        sortable: false,
        filter: false,
        resizable: false,
      });
    }

    // 选择列 - 默认显示 checkbox，除非明确指定 radio
    if (props.rowSelection) {
      const isRadio = props.rowSelection.type === 'radio';
      // checkboxSelection 默认为 true（除非明确指定 radio）
      const showCheckbox = props.rowSelection.checkboxSelection !== undefined
        ? props.rowSelection.checkboxSelection
        : !isRadio;

      if (showCheckbox) {
        result.push({
          headerCheckboxSelection: !isRadio,
          checkboxSelection: true,
          showDisabledCheckboxes: true,
          width: 50,
          pinned: props.rowSelection.fixed ?? 'left',
          lockPosition: true,
          suppressMenu: true,
          resizable: false,
          sortable: false,
          filter: false,
          suppressAutoSize: true,
          suppressMovable: true,
          suppressColumnsToolPanel: true,
          lockPinned: true,
          lockVisible: true,
        });
      }
    }

    // 数据列（支持分组）
    result.push(...convertToAgGridCols(cols));

    // 操作列
    if (props.rowActions) {
      result.push({
        headerName: '操作',
        width: props.rowActions.maxVisible
          ? props.rowActions.maxVisible > 3
            ? 200
            : props.rowActions.maxVisible * 80 + 80
          : 200,
        pinned: 'right',
        cellRenderer: ActionsRenderer,
        cellRendererParams: {
          config: props.rowActions,
        },
        suppressMenu: true,
        sortable: false,
        filter: false,
        resizable: false,
      });
    }

    // 自定义列
    result.push(...customCols.customColumnDefs.value);

    return result;
  }

  // 计算 loading 状态
  const isLoading = computed(() => props.loading || remote.loading.value);

  // 构建 gridOptions
  const gridOptions = computed(() => ({
    ...props.gridOptions,
    rowData: currentData.value,
    columnDefs: buildColumnDefs(),
    defaultColDef,
    domLayout: props.domLayout,
    getRowId: (params: any) => {
      if (typeof props.rowKey === 'function') {
        return props.rowKey(params.data);
      }
      return params.data[props.rowKey];
    },
    rowSelection:
      props.rowSelection?.type === 'radio' ? ('single' as const) : ('multiple' as const),
    suppressRowClickSelection: true,
    rowBuffer: 25,
    singleClickEdit: true,
    stopEditingWhenCellsLoseFocus: true,
    maintainColumnOrder: true,
    onSelectionChanged: (e: any) => onSelectionChanged(e),
    onSortChanged: (e: any) => remote.onSortChanged(e),
    onCellValueChanged: (e: any) => edit.onCellValueChanged(e),
    pagination: !!props.pagination,
    paginationPageSize: pagination.pageSize.value,
    suppressPaginationPanel: true,
  }));

  // 根类名 - 不包含 ag-theme-alpine
  const rootClass = computed(() => ['nv-grid', props.class]);

  // 根样式
  const rootStyle = computed(() => {
    if (props.domLayout === 'autoHeight') {
      return [props.style, { height: 'auto' }];
    }
    return props.style;
  });

  // AG Grid 容器类名 - 包含 ag-theme-alpine
  const gridContainerClass = computed(() => ['nv-grid__container', 'ag-theme-alpine']);

  // 暴露接口
  defineExpose<DataGridExposed<TData>>({
    gridApi: gridApi as any,
    fetch: remote.fetch,
    refresh: remote.refresh,
    pagination: (page: number, pageSize: number) => {
      pagination.goToPage(page);
      pagination.changePageSize(pageSize);
    },
    validate: validation.validate,
    setField: customCols.addColumn as any,
    deleteField: customCols.deleteColumn,
    saveFields: customCols.saveCustomColumns,
    resetFields: customCols.resetColumns,
    ready: () => !!gridApi.value,
    isClientMode: () => !props.fetch,
    focusPreviousCell: () => {
      // TODO: 实现焦点移动
    },
    expandRow: (data: TData) => detailCell.expandRow(data),
    collapseRow: (data: TData) => detailCell.collapseRow(data),
    expandAll: () => detailCell.expandAll(),
    collapseAll: () => detailCell.collapseAll(),
  });
</script>

<template>
  <div
    :class="rootClass"
    :style="rootStyle"
  >
    <!-- 搜索栏 -->
    <GridSearch
      v-if="props.showSearch"
      :keyword="search.keyword.value"
      :match-count="search.matchNodes.value.length"
      :current-match-index="search.currentMatchIndex.value"
      :placeholder="search.searchConfig.value?.placeholder"
      :on-search="search.search"
      :on-prev="search.prevMatch"
      :on-next="search.nextMatch"
      :on-clear="search.clearSearch"
    />

    <!-- 已选提示 -->
    <GridSelected
      v-if="props.rowSelection"
      :count="selectedRowKeys.length"
      :on-clear="deselectAll"
    />

    <!-- 列定制面板 -->
    <CustomColumnPanel
      v-if="props.customColumnPanelStorage"
      :columns="customCols.customColumns.value"
      :on-add="customCols.addColumn"
      :on-update="customCols.updateColumn"
      :on-delete="customCols.deleteColumn"
      :on-save="customCols.saveCustomColumns"
      :on-reset="customCols.resetColumns"
    />

    <!-- AG Grid - 主题 class 必须在 AgGridVue 的直接容器上 -->
    <div :class="gridContainerClass" :style="props.containerStyle">
      <AgGridVue
        style="width: 100%; height: 100%"
        :grid-options="gridOptions"
        @grid-ready="onGridReady"
      />
    </div>

    <!-- Loading -->
    <div
      v-if="isLoading"
      class="nv-grid__loading"
    >
      <div class="nv-grid__loading-spinner" />
      <span>加载中...</span>
    </div>

    <!-- Empty -->
    <div
      v-if="!isLoading && (!currentData || currentData.length === 0)"
      class="nv-grid__empty"
    >
      <el-empty :description="props.emptyText" />
    </div>

    <!-- 分页 -->
    <GridPagination
      v-if="props.pagination"
      :current="pagination.current.value"
      :page-size="pagination.pageSize.value"
      :total="pagination.total.value"
      :total-pages="pagination.totalPages.value"
      :show-size-changer="pagination.paginationInfo.value.showSizeChanger"
      :page-size-options="pagination.paginationInfo.value.pageSizeOptions"
      :show-total="pagination.paginationInfo.value.showTotal"
      :on-page-change="pagination.goToPage"
      :on-page-size-change="pagination.changePageSize"
    />
  </div>
</template>
