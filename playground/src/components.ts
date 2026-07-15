// 临时手动配置组件，后续完善自动扫描
export const components = [
  {
    name: 'Popup',
    path: '../packages/components/src/Popup',
    componentFile: '../packages/components/src/Popup/Popup.vue',
    demos: [
      {
        name: 'Basic',
        path: '@nova-kits/components/Popup/demos/Basic.vue',
      },
    ],
  },
];

export function getComponentDemos(name: string) {
  const component = components.find(c => c.name === name);
  return component ? component.demos : [];
}

export function getComponent(name: string) {
  return components.find(c => c.name === name);
}
