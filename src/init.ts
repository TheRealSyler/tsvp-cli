import { failure, successFile, success, info } from './messages';
import { join, normalize } from 'path';
import { writeFile, ensureFile, pathExists } from 'fs-extra';
import { exec } from 'child_process';

export async function Init(name: string) {
  if (name) {
    const getPath = (dir: string, fileName: string) => normalize(join(process.cwd(), name, dir, fileName));

    if (await pathExists(getPath('', ''))) {
      failure(`Folder ${name} Already Exists`);
      return;
    }

    try {
      const indexPath = getPath('src', 'index.ts');
      await ensureFile(indexPath);
      await writeFile(
        indexPath,
        `import { PluginObject } from 'vue';

const Plugin: PluginObject<{}> = {
  install(Vue, options) {
    console.log('[msg from ${name}]: ${name} Installed')
    const app = new Vue({
      methods: {
        hello () {
          console.log('Hello World!')
        }
      }
    });
    Vue.prototype.$hello = app.hello;
  }
};

export default Plugin;
`
      );
      successFile(indexPath);
      const packagePath = getPath('', 'package.json');
      await ensureFile(packagePath);
      await writeFile(
        packagePath,
        `{
  "name": "${name}",
  "version": "1.0.0",
  "description": "",
  "main": "dist/index.js",
  "scripts": {
    "prepack": "tsvp build",
    "build": "tsvp build",
    "watch": "tsvp watch"
  },
  "license": "MIT",
  "devDependencies": {
    "@babel/core": "^7.6.2",
    "@babel/plugin-transform-typescript": "7.5.5",
    "typescript": "^3.6.3"
  },
  "dependencies": {
    "vue": "^2.6.10"
  }
}`
      );
      successFile(packagePath);
      const tsconfigPath = getPath('', 'tsconfig.json');
      await ensureFile(tsconfigPath);
      await writeFile(
        tsconfigPath,
        `{
  "compilerOptions": {
    "declaration": true /* Required For tsvp to work */,
    "emitDeclarationOnly": true /* Required For tsvp to work */,
    "outDir": "./dist" /* Required For tsvp to work */,
    "rootDir": "./src" /* Required For tsvp to work */,

    /* Strict Type-Checking Options */
    "strict": false /* Enable all strict type-checking options. */,
    
    "esModuleInterop": true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
  },
  "exclude": ["build", "dist", "node_modules"]
}`
      );
      successFile(tsconfigPath);
      info("Installing Dependency's");
      exec(`cd ${name} && npm i`).on('close', exitCode => {
        success("Dependency's successfully installed!");
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    failure('Plugin Name Required');
  }
}
