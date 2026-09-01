<template>
  <div
    ref="filterRef"
    class="nv-filter"
    :class="{
      'nv-filter--simple': simple,
      'nv-filter--collapsed': collapsed && showCollapse,
    }"
  >
    <!-- Tab栏（非简化模式） -->
    <div
      v-if="!simple"
      class="nv-filter__tabbar"
    >
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        class="nv-filter__tab-item"
        :class="{ 'nv-filter__tab-item--active': activeTab === index }"
        @click="handleTabChange(index)"
      >
        <span>{{ tab.title === DEFAULT_TAB_ALIAS ? '默认' : tab.title }}</span>
        <el-dropdown
          v-if="activeTab === index && index !== 0"
          trigger="click"
          @command="handleTabCommand($event, index)"
        >
          <el-icon class="nv-filter__tab-arrow">
            <ArrowDown />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="rename">
                重命名
              </el-dropdown-item>
              <el-dropdown-item command="save">
                保存
              </el-dropdown-item>
              <el-dropdown-item command="delete">
                <span style="color: var(--el-color-danger)">删除</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div
        class="nv-filter__tab-item nv-filter__tab-add"
        @click="handleAddTab"
      >
        <el-icon><Plus /></el-icon>
      </div>
    </div>

    <!-- 筛选表单 -->
    <el-form
      :model="formModel"
      @submit.prevent="handleSubmit"
    >
      <div class="nv-filter__form-layout">
        <template
          v-for="(item, index) in sortedData"
          :key="item.key"
        >
          <div
            v-if="!preserveFields ? !isFieldHidden(item) : true"
            class="nv-filter__form-item"
            :class="{
              [`nv-filter__form-item--col-${item.colSpan || 1}`]: true,
              'nv-filter__form-item--hidden': !activeKeys.includes(item.key),
              'nv-filter__form-item--extra': isExtraItem(index),
            }"
          >
            <template v-if="item.renderFormItem">
              <component :is="item.renderFormItem" />
            </template>
            <template v-else-if="item.type">
              <el-form-item
                :label="item.label"
                :prop="item.key"
              >
                <component
                  :is="getComponent(item.type)"
                  v-model="formModel[item.key]"
                  v-bind="getComponentProps(item)"
                />
              </el-form-item>
            </template>
          </div>
        </template>

        <!-- 操作按钮 -->
        <div class="nv-filter__actions">
          <div class="nv-filter__btn-group">
            <el-button
              type="primary"
              native-type="submit"
            >
              查询
            </el-button>
            <el-button @click="handleReset">
              重置
            </el-button>
            <el-link
              v-if="showCollapse"
              class="nv-filter__collapse-btn"
              :underline="false"
              @click="collapsed = !collapsed"
            >
              {{ collapsed ? '高级搜索' : '收起搜索' }}
            </el-link>
            <!--            <FilterFieldsConfig-->
            <!--              v-if="enableFieldsConfig || (!simple && enableFieldsConfig !== false)"-->
            <!--              :origin-data="data"-->
            <!--              :value="fields"-->
            <!--              @change="handleFieldsChange"-->
            <!--              @save="handleFieldsSave"-->
            <!--            />-->
          </div>
        </div>
      </div>
    </el-form>

    <!-- 方案保存弹窗 -->
    <el-dialog
      v-model="showModal"
      title="筛选方案"
      width="300"
      @close="handleModalClose"
    >
      <el-form
        ref="modalFormRef"
        :model="modalForm"
        :rules="modalRules"
        label-width="60"
      >
        <el-form-item
          label="名称"
          prop="name"
        >
          <el-input
            v-model="modalForm.name"
            maxlength="8"
            show-word-limit
            placeholder="请输入方案名称"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showModal = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="handleModalOk"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, type Component } from 'vue';
  import {
    ElMessage,
    ElMessageBox,
    ElButton,
    ElDialog,
    ElIcon,
    ElInput,
    ElSelect,
    ElDatePicker,
    ElInputNumber,
    ElForm,
    ElFormItem,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
    ElLink,
  } from 'element-plus';
  import type { FormInstance } from 'element-plus';
  import { ArrowDown, Plus } from '@element-plus/icons-vue';
  // import FilterFieldsConfig from './FilterFieldsConfig.vue';
  import type { FilterProps, FilterEmits, FilterView, FilterItemType } from './types';

  const props = withDefaults(defineProps<FilterProps>(), {
    simple: false,
    defaultCollapsed: true,
    autoPlaceholder: false,
    preserveFields: true,
    enableFieldsConfig: undefined,
  });

  const emit = defineEmits<FilterEmits>();

  // 默认方案别名
  const DEFAULT_TAB_ALIAS = '$$default';

  // 内置组件映射
  const builtInComponentMap: Record<string, Component> = {
    input: ElInput,
    select: ElSelect,
    'date-picker': ElDatePicker,
    'input-number': ElInputNumber,
  };

  // 内置组件默认属性
  const builtInDefaultProps: Record<string, Record<string, any>> = {
    input: { clearable: true },
    select: { clearable: true },
    'date-picker': {},
    'input-number': {},
  };

  // refs
  const filterRef = ref<HTMLElement | null>(null);
  const modalFormRef = ref<FormInstance | null>(null);

  // 状态
  const formModel = ref<Record<string, any>>({});
  const tabs = ref<FilterView[]>([]);
  const activeTab = ref(0);
  const collapsed = ref(props.defaultCollapsed);
  const showModal = ref(false);
  const modalAction = ref<'add' | 'rename'>('add');
  const modalTarget = ref(-1);
  const modalForm = ref({ name: '' });

  // 弹窗表单校验规则
  const modalRules = {
    name: [
      { required: true, message: '请输入方案名称', trigger: 'blur' },
      { min: 1, max: 8, message: '名称长度不超过8个字符', trigger: 'blur' },
    ],
  };

  // 组件映射
  const compMap = builtInComponentMap;

  // 空值
  const emptyValue = computed(() => {
    return Object.fromEntries(props.data.map(item => [item.key, undefined]));
  });

  // 默认值
  const defaultValue = computed(() => {
    return props.defaultValue || props.value || {};
  });

  // 默认方案
  const defaultTab = computed<FilterView>(() => ({
    title: DEFAULT_TAB_ALIAS,
    value: defaultValue.value,
    fields: props.data.map(item => ({
      key: item.key,
      hidden: false,
    })),
  }));

  // 字段配置
  const fields = computed(() => {
    const tabFields = tabs.value[activeTab.value]?.fields ?? [];
    return props.data.map(item => {
      const field = tabFields.find(f => f.key === item.key);
      return {
        key: item.key,
        label: item.label,
        hidden: field?.hidden ?? false,
        lockVisible: item.lockVisible,
        hiddenInFields: !!item.defaultHidden,
      };
    });
  });

  // 活跃的字段 keys
  const activeKeys = computed(() => {
    return fields.value.filter(item => !item.hidden).map(item => item.key);
  });

  // 排序后的数据
  const sortedData = computed(() => {
    const tabFields = tabs.value[activeTab.value]?.fields ?? [];
    const temp = props.data.map(item => {
      const pos = tabFields.findIndex(f => f.key === item.key);
      return {
        key: item.key,
        pos,
        data: item,
      };
    });

    const sortedTemp = temp.filter(item => item.pos !== -1).sort((a, b) => a.pos - b.pos);
    const result: FilterItemType[] = [];
    let sortedIndex = 0;

    temp.forEach(item => {
      if (item.pos === -1) {
        result.push(item.data);
      } else {
        result.push(sortedTemp[sortedIndex++].data);
      }
    });

    return result;
  });

  // 是否显示折叠按钮
  const showCollapse = computed(() => {
    return sortedData.value.length > 3;
  });

  // 是否字段隐藏
  const isFieldHidden = (item: FilterItemType) => {
    return !activeKeys.value.includes(item.key);
  };

  // 是否为折叠后隐藏的额外字段（index >= 3 且当前为折叠状态）
  const COLLAPSE_THRESHOLD = 3;
  const isExtraItem = (index: number) => {
    return collapsed.value && index >= COLLAPSE_THRESHOLD;
  };

  // 获取组件
  const getComponent = (type: string): Component | null => {
    return compMap[type] ?? null;
  };

  // 获取组件属性
  const getComponentProps = (item: FilterItemType) => {
    const defaultProps = builtInDefaultProps[item.type ?? ''] ?? {};
    const componentProps: Record<string, any> = { ...defaultProps, ...item.extraProps };
    if (props.autoPlaceholder && item.label && item.type) {
      const action = item.type.includes('select') ? '选择' : '输入';
      componentProps.placeholder = `请${action}${item.label}`;
    }
    return componentProps;
  };

  // 提交表单
  const handleSubmit = () => {
    const value = { ...formModel.value };
    emit('change', value, 'submit');
    emit('update:value', value);
  };

  // 重置表单
  const handleReset = () => {
    formModel.value = { ...emptyValue.value, ...defaultValue.value };
    emit('change', formModel.value, 'reset');
    emit('update:value', formModel.value);
  };

  // Tab 切换
  const handleTabChange = (index: number) => {
    if (index === activeTab.value) return;
    activeTab.value = index;
    const tab = tabs.value[index];
    formModel.value = { ...emptyValue.value, ...defaultValue.value, ...tab.value };
    emit('change', formModel.value, 'reset');
    emit('update:value', formModel.value);
    saveStorage();
  };

  // Tab 命令处理
  const handleTabCommand = (command: string, index: number) => {
    switch (command) {
      case 'rename':
        handleRenameTab(index);
        break;
      case 'save':
        handleSaveTab(index);
        break;
      case 'delete':
        handleDeleteTab(index);
        break;
    }
  };

  // 保存 Tab
  const handleSaveTab = (index: number) => {
    const tab = tabs.value[index];
    tabs.value.splice(index, 1, {
      ...tab,
      value: { ...formModel.value },
    });
    saveStorage();
    ElMessage.success('保存成功');
  };

  // 重命名 Tab
  const handleRenameTab = (index: number) => {
    modalAction.value = 'rename';
    modalTarget.value = index;
    modalForm.value.name =
      tabs.value[index].title === DEFAULT_TAB_ALIAS ? '' : tabs.value[index].title;
    showModal.value = true;
  };

  // 删除 Tab
  const handleDeleteTab = async (index: number) => {
    if (index === 0) {
      ElMessage.warning('不允许删除默认方案');
      return;
    }

    try {
      await ElMessageBox.confirm(`确定删除${tabs.value[index].title}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });

      tabs.value.splice(index, 1);
      activeTab.value = index - 1;
      saveStorage();
    } catch {
      // 取消删除
    }
  };

  // 添加 Tab
  const handleAddTab = () => {
    if (tabs.value.length >= 6) {
      ElMessage.warning('查询方案总数不可超过6个');
      return;
    }

    modalAction.value = 'add';
    modalTarget.value = -1;
    modalForm.value.name = '';
    showModal.value = true;
  };

  // 弹窗确定
  const handleModalOk = async () => {
    if (!modalFormRef.value) return;

    try {
      await modalFormRef.value.validate();

      const name = modalForm.value.name;
      const checkSameTitle = () => {
        const exist = tabs.value.findIndex(item => {
          return item.title === name || (name === '默认' && item.title === DEFAULT_TAB_ALIAS);
        });
        if (exist > -1) {
          ElMessage.warning('名称已存在，请重新填写');
          return true;
        }
        return false;
      };

      if (modalAction.value === 'add') {
        if (checkSameTitle()) return;

        const newTab: FilterView = {
          title: name,
          value: { ...formModel.value },
          fields: tabs.value[activeTab.value].fields,
        };
        tabs.value.push(newTab);
        activeTab.value = tabs.value.length - 1;
        saveStorage();
      } else {
        if (tabs.value[modalTarget.value].title === name) {
          showModal.value = false;
          return;
        }
        if (checkSameTitle()) return;

        tabs.value[modalTarget.value].title = name;
        saveStorage();
      }

      showModal.value = false;
    } catch {
      // 验证失败
    }
  };

  // 弹窗关闭
  const handleModalClose = () => {
    modalFormRef.value?.resetFields();
  };

  // 字段变化
  const handleFieldsChange = (newFields: { key: string; hidden: boolean }[]) => {
    tabs.value[activeTab.value] = {
      ...tabs.value[activeTab.value],
      fields: newFields.map(item => ({
        key: item.key,
        hidden: item.hidden,
      })),
    };
  };

  // 字段保存
  const handleFieldsSave = () => {
    saveStorage();
  };

  // 存储数据格式
  interface StorageData {
    tabs: FilterView[];
    activeTab: number;
  }

  // 加载存储
  const loadStorage = () => {
    if (!props.storageKey) return;
    try {
      const data = localStorage.getItem(`nv-filter-${props.storageKey}`);
      if (data) {
        const parsed = JSON.parse(data) as StorageData;
        if (parsed.tabs.length > 0) {
          // 确保第一个是默认方案
          const hasDefault = parsed.tabs.some((t: FilterView) => t.title === DEFAULT_TAB_ALIAS);
          if (!hasDefault) {
            parsed.tabs.unshift(defaultTab.value);
          }
          tabs.value = parsed.tabs;
          activeTab.value = parsed.activeTab;
        }
      }
    } catch {
      // 存储读取失败，静默处理
    }
  };

  // 保存存储
  const saveStorage = () => {
    if (!props.storageKey) return;
    try {
      localStorage.setItem(
        `nv-filter-${props.storageKey}`,
        JSON.stringify({
          tabs: tabs.value,
          activeTab: activeTab.value,
        })
      );
    } catch {
      // 存储写入失败，静默处理
    }
  };

  // 初始化表单模型
  const initFormModel = () => {
    const value = props.value || {};
    formModel.value = { ...emptyValue.value, ...defaultValue.value, ...value };
    prevFormSnapshot.value = { ...formModel.value };
  };

  onMounted(() => {
    // 加载存储
    loadStorage();

    // 初始化 Tab
    if (tabs.value.length === 0) {
      tabs.value = [{ ...defaultTab.value }];
    }

    // 初始化表单
    initFormModel();
  });

  // 监听 value 变化
  watch(
    () => props.value,
    newValue => {
      if (newValue) {
        formModel.value = { ...emptyValue.value, ...defaultValue.value, ...newValue };
      }
    },
    { deep: true }
  );

  // 监听 formModel 变化，触发 values-change
  const prevFormSnapshot = ref<Record<string, any>>({});
  watch(
    () => formModel.value,
    newVal => {
      const oldVal = prevFormSnapshot.value;
      const changedValues: Record<string, any> = {};
      for (const key of Object.keys(newVal)) {
        if (newVal[key] !== oldVal[key]) {
          changedValues[key] = newVal[key];
        }
      }
      prevFormSnapshot.value = { ...newVal };
      if (Object.keys(changedValues).length > 0) {
        emit('values-change', changedValues, { ...newVal });
      }
    },
    { deep: true }
  );
</script>

<style scoped lang="scss">
  .nv-filter {
    // Tab栏
    &__tabbar {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: var(--nk-padding-sm);
      gap: var(--nk-padding-xs);
    }

    &__tab-item {
      display: flex;
      align-items: center;
      height: 28px;
      padding: 0 var(--nk-padding-md);
      color: #666;
      line-height: 28px;
      background-color: #f2f3f5;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover:not(&--active) {
        background-color: #e8eaec;
      }

      &--active {
        color: var(--el-color-primary);
        background-color: var(--el-color-primary-light-9);
      }
    }

    &__tab-arrow {
      margin-left: 4px;
      font-size: 12px;
    }

    &__tab-add {
      width: 28px;
      padding: 0;
      justify-content: center;
      font-size: 12px;
    }

    // 表单布局
    &__form-layout {
      display: flex;
      flex-wrap: wrap;
      gap: var(--nk-padding-sm);
    }

    &__form-item {
      flex: 1;
      min-width: 200px;

      &--col-2 {
        min-width: 400px;
      }

      &--col-3 {
        min-width: 600px;
      }

      &--col-4 {
        min-width: 800px;
      }

      &--hidden {
        display: none;
      }
    }

    // 操作按钮
    &__actions {
      display: flex;
      align-items: flex-start;
      gap: var(--nk-padding-sm);
      padding: 0 var(--nk-padding-sm);
    }

    &__btn-group {
      display: flex;
      align-items: center;
      gap: var(--nk-padding-xs);
    }

    &__collapse-icon--expanded {
      transform: rotate(180deg);
    }

    // 折叠状态
    &--collapsed &__form-item--extra {
      display: none;
    }
  }
</style>
