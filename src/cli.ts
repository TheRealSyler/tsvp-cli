#!/usr/bin/env node
import { failure } from './messages';
import { Watch } from './watch';
import { Build } from './build';
import { Init } from './init';
import chalk from 'chalk';
import { readFile } from 'fs-extra';

class Start {
  args: string[];
  constructor() {
    const [, , ...argumentArr] = process.argv;
    this.args = [];
    argumentArr.forEach((arg, i) => {
      this.args[i] = arg === undefined ? '' : arg.toLowerCase();
    });
    this.run();
  }
  private async run() {
    switch (this.args[0]) {
      case 'watch':
      case '--w':
      case '-w':
      case 'w':
        Watch();
        break;
      case 'build':
      case '--b':
      case '-b':
      case 'b':
        Build();
        break;
      case 'init':
      case '--i':
      case '-i':
      case 'i':
        Init(this.args[1]);
        break;
      case '-v':
        const file = await readFile('package.json');
        console.log(chalk.green(`v${JSON.parse(file.toString()).version} Node: ${process.version}`));
        break;
      default:
        failure('Error! No Command Given.');
        break;
    }
  }
}
new Start();
