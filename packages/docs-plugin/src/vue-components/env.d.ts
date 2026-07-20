declare module 'virtual:nova-meta' {
  interface ComponentMetaEntry {
    props: Array<{ name: string; type: string; required: boolean; default: string; description: string }>;
    events: Array<{ name: string; type: string; description: string }>;
    slots: Array<{ name: string; type: string; description: string }>;
    expose: Array<{ name: string; type: string; description: string }>;
  }

  const metaMap: Record<string, ComponentMetaEntry | undefined>;
  export default metaMap;
}

declare module 'virtual:nova-demos' {
  import type { Component } from 'vue';

  interface DemoEntry {
    component: () => Promise<{ default: Component }>;
    source: string;
  }

  const demos: Record<string, DemoEntry | undefined>;
  export default demos;
}
