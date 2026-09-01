<template>
  <NSection title="带操作栏">
    <template #actions>
      <el-button type="primary" size="small">
        新增
      </el-button>
      <el-button size="small">
        导出
      </el-button>
    </template>
    <p>这是一个带操作栏的 Section 组件示例</p>
  </NSection>
</template>

<script lang="ts" setup>
import {NSection, ElButton} from '@nova-kits/components';
</script>
