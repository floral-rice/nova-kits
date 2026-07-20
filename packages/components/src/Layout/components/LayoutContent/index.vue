<template>
  <template v-if="$slots.header">
    <div>
      <slot name="header" />
    </div>
  </template>
  <div>
    <template v-if="$slots.left">
      <div>
        <slot name="left" />
      </div>
    </template>
    <div><slot /></div>
  </div>
  <template v-if="$slots.footer">
    <div>
      <slot name="footer" />
    </div>
  </template>
</template>

<script setup lang="ts">

</script>

<style scoped></style>
