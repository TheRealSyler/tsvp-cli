import { Walk, WriteToFile } from './utils';
import chalk from 'chalk';
import { exec } from 'child_process';
import { emptyDir } from 'fs-extra';

export async function Build() {
  const now = process.hrtime.bigint();
  let canEnd = false;

  emptyDir('dist').then(async () => {
    console.log(chalk.green(`Dist Cleared      - Finished At: ${((process.hrtime.bigint() - now) / BigInt(1e6)).toString()} ms`));
    exec('tsc -d', err => {
      if (err) console.log(err);
      console.log(chalk.green(`Build Types       - Finished At: ${((process.hrtime.bigint() - now) / BigInt(1e6)).toString()} ms`));
      if (canEnd) {
        end(now);
      } else {
        canEnd = true;
      }
    });
    try {
      const filesPaths = await Walk('./src');
      for (let i = 0; i < filesPaths.length; i++) {
        WriteToFile(filesPaths[i], null);
      }
      console.log(chalk.green(`Build Files       - Finished At: ${((process.hrtime.bigint() - now) / BigInt(1e6)).toString()} ms`));
      if (canEnd) {
        end(now);
      } else {
        canEnd = true;
      }
    } catch (error) {
      console.log(error);
    }
  });
}

function end(now: bigint) {
  console.log(chalk.green(`Total Build Time  -              ${((process.hrtime.bigint() - now) / BigInt(1e6)).toString()} ms`));
}
