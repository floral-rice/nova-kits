import type { VNode } from 'vue'

/**
 * 筛选项配置
 */
export interface FilterItemType {
  /** 唯一标识 */
  key: string
  /** 显示标签 */
  label?: string
  /** 组件类型 */
  type?: 'input' | 'select' | 'date-picker' | 'input-number' | string
  /** 占用列数 (1-4) */
  colSpan?: number
  /** 额外属性 */
  extraProps?: Record<string, any>
  /** 自定义渲染 */
  renderFormItem?: () => VNode
  /** 默认隐藏 */
  defaultHidden?: boolean
  /** 禁止设置隐藏 */
  lockVisible?: boolean
}

/**
 * 操作类型
 */
export type ActionType = 'submit' | 'reset'

/**
 * 筛选方案视图
 */
export interface FilterView {
  /** 方案名称 */
  title: string
  /** 方案值 */
  value?: Record<string, any>
  /** 字段配置 */
  fields: {
    key: string
    hidden: boolean
  }[]
}

/**
 * 组件选项
 */
export interface ComponentOption {
  type: string
  colSpan?: number
  render: (item: FilterItemType) => VNode
}

/**
 * Filter 组件 Props
 */
export interface FilterProps {
  /** 筛选项配置 */
  data: FilterItemType[]
  /** 当前值 */
  value?: Record<string, any>
  /** 默认值 */
  defaultValue?: Record<string, any>
  /** 简化模式（无Tab栏） */
  simple?: boolean
  /** 默认折叠 */
  defaultCollapsed?: boolean
  /** 自动生成placeholder */
  autoPlaceholder?: boolean
  /** 隐藏字段时保留值 */
  preserveFields?: boolean
  /** 本地存储key */
  storageKey?: string
  /** 启用列配置 */
  enableFieldsConfig?: boolean
}

/**
 * Filter 组件 Emits
 */
export interface FilterEmits {
  /** 值更新 */
  'update:value': [value: Record<string, any>]
  /** 值变化（查询/重置触发） */
  'change': [value: Record<string, any>, actionType: ActionType]
  /** 字段值变化 */
  'values-change': [changedValues: Record<string, any>, allValues: Record<string, any>]
}
