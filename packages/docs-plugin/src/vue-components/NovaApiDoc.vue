<template>
  <div class="nova-api-doc">
    <div v-if="meta">
      <!-- Props Table -->
      <div
        v-if="meta.props.length > 0"
        class="nova-api-section"
      >
        <h3>Props</h3>
        <table class="nova-api-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="prop in meta.props"
              :key="prop.name"
            >
              <td>
                <code>{{ prop.name }}</code>
              </td>
              <td>
                <code>{{ prop.type }}</code>
              </td>
              <td>
                <code>{{ prop.default || '—' }}</code>
              </td>
              <td>{{ prop.description || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Events Table -->
      <div
        v-if="meta.events.length > 0"
        class="nova-api-section"
      >
        <h3>Events</h3>
        <table class="nova-api-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="event in meta.events"
              :key="event.name"
            >
              <td>
                <code>{{ event.name }}</code>
              </td>
              <td>
                <code>{{ event.type }}</code>
              </td>
              <td>{{ event.description || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Slots Table -->
      <div
        v-if="meta.slots.length > 0"
        class="nova-api-section"
      >
        <h3>Slots</h3>
        <table class="nova-api-table">
          <thead>
            <tr>
              <th>Slot</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="slot in meta.slots"
              :key="slot.name"
            >
              <td>
                <code>{{ slot.name }}</code>
              </td>
              <td>
                <code>{{ slot.type }}</code>
              </td>
              <td>{{ slot.description || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Expose Table -->
      <div
        v-if="meta.expose.length > 0"
        class="nova-api-section"
      >
        <h3>Expose</h3>
        <table class="nova-api-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in meta.expose"
              :key="item.name"
            >
              <td>
                <code>{{ item.name }}</code>
              </td>
              <td>
                <code>{{ item.type }}</code>
              </td>
              <td>{{ item.description || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-else
      class="nova-api-empty"
    >
      No API data found for component: {{ component }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import metaMap from 'virtual:nova-meta';

const props = defineProps<{
  component: string;
}>();

const meta = computed(() => metaMap[props.component]);
</script>

<style scoped>
.nova-api-doc {
  margin: 24px 0;
}

.nova-api-section {
  margin-bottom: 24px;
}

.nova-api-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.nova-api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.nova-api-table th,
.nova-api-table td {
  text-align: left;
  padding: 10px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.nova-api-table th {
  font-weight: 600;
  background: var(--vp-c-bg-soft);
}

.nova-api-table code {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
  padding: 2px 6px;
  border-radius: 4px;
}

.nova-api-empty {
  color: var(--vp-c-text-2);
  font-style: italic;
  padding: 16px;
  text-align: center;
}
</style>
