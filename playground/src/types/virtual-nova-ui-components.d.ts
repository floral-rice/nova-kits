
declare module 'virtual:nova-kits-components' {
  export interface ComponentInfo {
    name: string;
    path: string;
    componentFile: string;
    component: Component;
    demos: {
      name: string;
      path: string;
      component: Component;
    }[];
    meta: {
      props: Record<string, unknown>[];
      events: Array<{
        name: string;
        description?: string;
        params?: Array<{ name: string; type: string; description?: string }>;
      }>;
      slots: Array<{
        name: string;
        description?: string;
      }>;
    };
  }

  export const components: ComponentInfo[];

  export function getComponentDemos(name: string): ComponentInfo['demos'];

  export function getComponent(name: string): ComponentInfo | undefined;
}

