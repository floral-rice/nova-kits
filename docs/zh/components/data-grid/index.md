# DataGrid 数据表格

基于 AG Grid + Element Plus 的增强表格组件，提供丰富的功能和灵活的配置。

## API

### Props

| 属性                     | 类型                                                   | 默认值       | 说明             |
| ------------------------ | ------------------------------------------------------ | ------------ | ---------------- |
| dataSource               | `TData[]`                                              | -            | 数据源           |
| columns                  | `ColsType<TData>`                                      | -            | 列定义           |
| rowKey                   | `string \| (data: TData) => string`                    | -            | 行唯一标识       |
| rowSelection             | `RowSelectionType<TData>`                              | -            | 行选择配置       |
| pagination               | `boolean \| PaginationType`                            | -            | 分页配置         |
| fetch                    | `(params: FetchParams) => Promise<FetchResult<TData>>` | -            | 远程数据请求     |
| rowActions               | `RowActionsType<TData>`                                | -            | 行操作配置       |
| summary                  | `SummaryType \| Record<string, any>[]`                 | -            | 汇总行配置       |
| detailCell               | `DetailCell<TData>`                                    | -            | 主从表配置       |
| showSearch               | `boolean \| DataGridSearch<TData>`                     | -            | 搜索配置         |
| customColumnPanelStorage | `CustomColumnStorage`                                  | -            | 自定义列存储     |
| loading                  | `boolean`                                              | `false`      | 加载状态         |
| emptyText                | `string`                                               | `'暂无数据'` | 空数据文案       |
| autoLoad                 | `boolean`                                              | `true`       | 自动加载数据     |
| showIndex                | `boolean`                                              | `false`      | 显示序号列       |
| gridOptions              | `GridOptions`                                          | -            | AG Grid 原生配置 |

### Events

| 事件名            | 说明         | 回调参数                                                              |
| ----------------- | ------------ | --------------------------------------------------------------------- |
| grid-ready        | 表格就绪     | `(api: GridApi)`                                                      |
| row-click         | 行点击       | `(data: TData, event: MouseEvent)`                                    |
| row-double-click  | 行双击       | `(data: TData, event: MouseEvent)`                                    |
| cell-click        | 单元格点击   | `(data: TData, colDef: ColType<TData>, event: MouseEvent)`            |
| cell-value-change | 单元格值变化 | `(data: TData, colDef: ColType<TData>, newValue: any, oldValue: any)` |

### Methods

| 方法名      | 说明     | 参数                                                |
| ----------- | -------- | --------------------------------------------------- |
| refresh     | 刷新表格 | -                                                   |
| fetch       | 请求数据 | `(page?: number) => void`                           |
| validate    | 校验全表 | `() => Promise<boolean \| ValidateResult<TData>[]>` |
| expandRow   | 展开行   | `(data: TData) => void`                             |
| collapseRow | 收起行   | `(data: TData) => void`                             |
| expandAll   | 全部展开 | `() => void`                                        |
| collapseAll | 全部收起 | `() => void`                                        |

### 列定义 (ColType)

| 属性      | 类型                                                          | 说明               |
| --------- | ------------------------------------------------------------- | ------------------ |
| title     | `string \| (params: IHeaderParams) => VNode`                  | 列标题             |
| dataIndex | `string`                                                      | 数据字段           |
| render    | `(value, record, index, params) => VNode \| string \| number` | 自定义渲染         |
| editable  | `EditableConfig<TData>`                                       | 可编辑配置         |
| 其他      | `ColDef`                                                      | AG Grid 原生列配置 |

### 行选择配置 (RowSelectionType)

| 属性            | 类型                                      | 说明         |
| --------------- | ----------------------------------------- | ------------ |
| type            | `'checkbox' \| 'radio'`                   | 选择类型     |
| selectedRowKeys | `string[]`                                | 受控选中项   |
| onChange        | `(keys: string[], rows: TData[]) => void` | 选择变化回调 |

### 分页配置 (PaginationType)

| 属性            | 类型                                       | 说明             |
| --------------- | ------------------------------------------ | ---------------- |
| current         | `number`                                   | 当前页           |
| pageSize        | `number`                                   | 每页条数         |
| pageSizeOptions | `number[]`                                 | 每页条数选项     |
| showSizeChanger | `boolean`                                  | 显示切换每页条数 |
| showTotal       | `(total: number) => string`                | 显示总条数       |
| onChange        | `(page: number, pageSize: number) => void` | 分页变化回调     |

### 行操作配置 (RowActionsType)

| 属性       | 类型                     | 说明                               |
| ---------- | ------------------------ | ---------------------------------- |
| actions    | `RowActionType<TData>[]` | 操作列表                           |
| maxVisible | `number`                 | 最大可见操作数，超出显示为下拉菜单 |

### 汇总配置 (SummaryType)

| 属性   | 类型                                   | 说明           |
| ------ | -------------------------------------- | -------------- |
| sum    | `string[]`                             | 求和字段       |
| avg    | `string[]`                             | 平均值字段     |
| count  | `boolean`                              | 计数           |
| max    | `string[]`                             | 最大值字段     |
| min    | `string[]`                             | 最小值字段     |
| custom | `Record<string, (data: any[]) => any>` | 自定义汇总函数 |

### 主从表配置 (DetailCell)

| 属性          | 类型                                                 | 说明           |
| ------------- | ---------------------------------------------------- | -------------- |
| render        | `(data: TData, rowIndex: number) => VNode \| string` | 详情渲染函数   |
| height        | `number \| (data: TData) => number`                  | 详情高度       |
| getExpandable | `(data: TData) => boolean`                           | 判断是否可展开 |

### 编辑器配置 (EditableConfig)

| 属性        | 类型                                       | 说明         |
| ----------- | ------------------------------------------ | ------------ |
| renderer    | `'text' \| 'number' \| 'date' \| 'select'` | 编辑器类型   |
| enable      | `(params) => boolean`                      | 是否可编辑   |
| rules       | `ValidateRule<TData>[]`                    | 校验规则     |
| valueSetter | `(val, data) => Partial<TData>`            | 自定义值设置 |
| params      | `Record<string, any>`                      | 编辑器参数   |

### 校验规则 (ValidateRule)

| 属性      | 类型                                 | 说明            |
| --------- | ------------------------------------ | --------------- |
| required  | `boolean`                            | 必填            |
| message   | `string`                             | 错误提示        |
| pattern   | `RegExp`                             | 正则校验        |
| min       | `number`                             | 最小值/最小长度 |
| max       | `number`                             | 最大值/最大长度 |
| validator | `(value, data) => boolean \| string` | 自定义校验器    |

## 基础用法

<demo src="./demo/basic.vue"/>

## 行选择

支持 checkbox 多选和 radio 单选模式。

<demo src="./demo/selection.vue" />

## 分页

支持客户端分页和服务端分页。

<demo src="./demo/pagination.vue" />

## 远程数据

通过 `fetch` 函数实现远程数据加载。

<demo src="./demo/remote.vue"/>

## 单元格编辑

支持多种编辑器类型：文本、数字、日期、下拉选择。

<demo src="./demo/editable.vue"/>

## 数据校验

基于 async-validator 的数据校验功能。

```vue
<script setup>
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      editable: {
        renderer: 'text',
        rules: [
          { required: true, message: '请输入姓名' },
          { min: 2, max: 20, message: '姓名长度为 2-20 个字符' },
        ],
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      editable: {
        renderer: 'text',
        rules: [
          { required: true, message: '请输入邮箱' },
          { pattern: /^[\w.-]+@[\w.-]+\.\w+$/, message: '邮箱格式不正确' },
        ],
      },
    },
  ];
</script>
```

## 行操作

支持操作按钮和下拉菜单。

<demo src="./demo/actions.vue"/>

## 汇总行

支持自动汇总计算和静态汇总行。

<demo src="./demo/summary.vue"/>

## 搜索

支持关键字过滤和搜索结果定位。

<demo src="./demo/search.vue"/>

## 主从表

支持行展开显示详情内容。

```vue
<template>
  <NDataGrid
    :data-source="data"
    :columns="columns"
    row-key="id"
    :detail-cell="{ render: renderDetail }"
  />
</template>

<script setup>
  function renderDetail(data, rowIndex) {
    return `<div>详情内容：${data.name}</div>`;
  }
</script>
```

## 自定义列

支持用户动态添加计算列。

```vue
<template>
  <NDataGrid
    :data-source="data"
    :columns="columns"
    row-key="id"
    :custom-column-panel-storage="storage"
  />
</template>

<script setup>
  const storage = {
    set: async data => localStorage.setItem('customColumns', JSON.stringify(data)),
    get: async () => JSON.parse(localStorage.getItem('customColumns') || 'null'),
  };
</script>
```

## 列分组

支持多级表头分组。

```vue
<script setup>
  const columns = [
    { title: '姓名', dataIndex: 'name' },
    {
      headerName: '信息',
      children: [
        { title: '年龄', dataIndex: 'age' },
        { title: '邮箱', dataIndex: 'email' },
      ],
    },
  ];
</script>
```
