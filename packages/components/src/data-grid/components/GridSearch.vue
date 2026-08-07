<script setup lang="ts">
  const props = defineProps<{
    keyword: string;
    matchCount: number;
    currentMatchIndex: number;
    placeholder?: string;
    onSearch: (keyword: string) => void;
    onPrev: () => void;
    onNext: () => void;
    onClear: () => void;
  }>();

  function handleInput(value: string) {
    props.onSearch(value);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        props.onPrev();
      } else {
        props.onNext();
      }
    }
    if (event.key === 'Escape') {
      props.onClear();
    }
  }
</script>

<template>
  <div class="nv-grid__search">
    <el-input
      :model-value="keyword"
      :placeholder="placeholder || '搜索...'"
      clearable
      size="small"
      @input="handleInput"
      @keydown="handleKeydown"
      @clear="onClear"
    >
      <template #prefix>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </template>
    </el-input>

    <div
      v-if="keyword"
      class="nv-grid__search-info"
    >
      <span class="nv-grid__search-count">
        {{ matchCount > 0 ? currentMatchIndex + 1 : 0 }} / {{ matchCount }}
      </span>
      <el-button-group size="small">
        <el-button
          :disabled="matchCount === 0"
          @click="onPrev"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </el-button>
        <el-button
          :disabled="matchCount === 0"
          @click="onNext"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </el-button>
      </el-button-group>
    </div>
  </div>
</template>
