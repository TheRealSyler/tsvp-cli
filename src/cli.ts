#!/usr/bin/env node
import { failure } from './messages';
import { Watch } from './watch';
import { Build } from './build';
import { Init } from './init';

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
  private run(): void {
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
      default:
        failure('Error! No Command Given.');
        break;
    }
  }
}
new Start();
