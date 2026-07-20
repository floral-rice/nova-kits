<template>
  <div class="nova-demo">
    <div class="nova-demo-preview">
      <component
        :is="demoComponent"
        v-if="demoComponent"
      />
      <div
        v-else
        class="nova-demo-error"
      >
        Demo not found: {{ demoKey }}
      </div>
    </div>
    <div class="nova-demo-actions">
      <button
        class="nova-demo-toggle"
        @click="showSource = !showSource"
      >
        {{ showSource ? '隐藏代码' : '查看代码' }}
      </button>
    </div>
    <div
      v-show="showSource"
      class="nova-demo-source"
    >
      <div class="nova-demo-source-inner">
        <pre><code>{{ source }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue';
import demos from 'virtual:nova-demos';

const props = defineProps<{
  demoKey: string;
}>();

const showSource = ref(false);

const demo = computed(() => demos[props.demoKey]);

const demoComponent = computed(() => {
  if (!demo.value) return null;
  return defineAsyncComponent(demo.value.component);
});

const source = computed(() => demo.value?.source ?? '');
</script>

<style scoped>
.nova-demo {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin: 16px 0;
  overflow: hidden;
}

.nova-demo-preview {
  padding: 24px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.nova-demo-actions {
  padding: 8px 16px;
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.nova-demo-toggle {
  background: none;
  border: none;
  color: var(--vp-c-brand);
  cursor: pointer;
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 4px;
}

.nova-demo-toggle:hover {
  background: var(--vp-c-brand-soft);
}

.nova-demo-source {
  background: var(--vp-c-bg-soft);
}

.nova-demo-source-inner {
  padding: 16px;
  overflow-x: auto;
}

.nova-demo-source-inner pre {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
}

.nova-demo-source-inner code {
  font-family: var(--vp-font-family-mono);
}

.nova-demo-error {
  color: var(--vp-c-danger);
  padding: 16px;
  text-align: center;
}
</style>
