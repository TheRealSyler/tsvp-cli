#!/usr/bin/env node
import { failure } from './messages';
import { Watch } from './watch';
import { Build } from './build';
import { Init } from './init';
import chalk from 'chalk';
import { readFile } from 'fs-extra';
import { GenerateFiles } from './generate';

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
      case 'w':
        Watch();
        break;
      case 'build':
      case 'b':
        Build();
        break;
      case 'init':
      case 'i':
        Init(this.args[1]);
        break;
      case '-v':
      case 'version':
        const file = await readFile('package.json');
        console.log(chalk.green(`v${JSON.parse(file.toString()).version}`));
        break;
      default:
        failure('Error! Command is Invalid.');
      case 'help':
      case '--help':
      case 'h':
        console.log(
          `  tsvp init PLUGIN-NAME      Initializes a new Typescript vue plugin
  tsvp build                 Builds the project.
  tsvp watch                 Builds on file changes.
  tsvp g PATH or TYPE PATH   Creates new empty files.
  tsvp -v                    Prints out the version of the package.`
        );
        break;
      case 'g':
      case 'generate':
        GenerateFiles(this.args);
        break;
    }
  }
}
new Start();
