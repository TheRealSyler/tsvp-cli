import { WriteToFile, DeleteFile } from './utils';
import { exec } from 'child_process';
import { watch } from 'chokidar';

import chalk from 'chalk';

export async function Watch() {
  exec('tsc -w', (err, stOut, stErr) => {
    if (err) console.log(err);
  }).on('message', msg => {
    console.log('TSC MSG: ', msg);
  });

  watch('src').on('all', async (type, path, stats) => {
    switch (type) {
      case 'add':
        console.log(chalk.green(`Added ${path}`));
      case 'change':
        WriteToFile(path, chalk.green(`Updated ${path} - THE_END ms`));
        break;
      case 'unlink':
        DeleteFile(path);
        break;
    }
  });
}
