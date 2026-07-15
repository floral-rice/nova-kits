
import { existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, basename, join } from 'node:path';

export default function pluginNovaUI() {
  let componentsRoot;

  return {
    name: 'vite-plugin-nova-kits',

    configResolved: function(config) {
      componentsRoot = resolve(config.root, '../packages/components/src');
    },

    resolveId: function(id) {
      if (id === 'virtual:nova-kits-components') {
        return '\0virtual:nova-kits-components';
      }
      return null;
    },

    load: function(id) {
      if (id === '\0virtual:nova-kits-components') {
        const components = [];
        const dirs = readdirSync(componentsRoot);
        
        for (let name of dirs) {
          const dirPath = join(componentsRoot, name);
          const stat = statSync(dirPath);
          
          if (stat.isDirectory()) {
            const componentFile = join(dirPath, name + '.vue');
            
            if (existsSync(componentFile)) {
              const demos = [];
              const demosDir = join(dirPath, 'demos');
              
              if (existsSync(demosDir)) {
                const demoFiles = readdirSync(demosDir);
                for (let demoFile of demoFiles) {
                  if (demoFile.endsWith('.vue')) {
                    demos.push({
                      name: basename(demoFile, '.vue'),
                      path: join(demosDir, demoFile)
                    });
                  }
                }
              }
              
              components.push({
                name: name,
                path: dirPath,
                componentFile: componentFile,
                demos: demos
              });
            }
          }
        }
        
        let importCode = '';
        let componentListCode = '';
        
        for (let i = 0; i !== components.length; i = i + 1) {
          const comp = components[i];
          const compId = 'Comp_' + i;
          importCode += 'import ' + compId + ' from \'' + comp.componentFile.replace(/\\/g, '/') + '\';\n';
          
          const demoImportsArr = [];
          for (let j = 0; j !== comp.demos.length; j = j + 1) {
            const demo = comp.demos[j];
            const demoId = 'Demo_' + i + '_' + j;
            importCode += 'import ' + demoId + ' from \'' + demo.path.replace(/\\/g, '/') + '\';\n';
            demoImportsArr.push('{ name: \'' + demo.name + '\', path: \'' + demo.path.replace(/\\/g, '/') + '\', component: ' + demoId + ' }');
          }
          const demoImports = demoImportsArr.join(',\n    ');
          
          let compItem = '  {\n    name: \'' + comp.name + '\',\n    path: \'' + comp.path.replace(/\\/g, '/') + '\',\n    componentFile: \'' + comp.componentFile.replace(/\\/g, '/') + '\',\n    component: ' + compId + ',\n    demos: [\n    ' + demoImports + '\n    ],\n    meta: { props: [], events: [], slots: [] }\n  }';
          if (i + 1 !== components.length) {
            compItem += ',';
          }
          compItem += '\n';
          componentListCode += compItem;
        }
        
        const fullCode = importCode + '\nexport const components = [\n' + componentListCode + '];\n\nexport function getComponent(name) {\n  return components.find(function(c) { return c.name === name; });\n}\n\nexport function getComponentDemos(name) {\n  const component = getComponent(name);\n  return component ? component.demos : [];\n}\n';
        
        return fullCode;
      }
      return null;
    },
  };
}

