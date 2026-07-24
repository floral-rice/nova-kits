<template>
  <Teleport v-if="targetId" :to="`#${targetId}`">
    <slot />
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLayoutContext } from './composables/useLayoutContext';

const props = defineProps<{
  to: 'header' | 'footer';
}>();

const ctx = useLayoutContext();

const targetId = computed(() => {
  if (!ctx) return null;
  return props.to === 'header' ? ctx.teleportIds.header : ctx.teleportIds.footer;
});
</script>
