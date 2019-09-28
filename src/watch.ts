import { WriteToFile, DeleteFile } from './utils';
import { exec } from 'child_process';
import { watch } from 'chokidar';
import chalk from 'chalk';

import { normalize, join } from 'path';

export async function Watch() {
  exec('tsc -w', (err, stOut, stErr) => {
    if (err) console.log(err);
  });

  watch('src').on('all', async (type, path, stats) => {
    switch (type) {
      case 'change':
        WriteToFile(path, chalk.green(`Updated ${path} - THE_END ms`));
        break;
      case 'unlink':
        DeleteFile(path);
        break;
    }
  });
  console.log(chalk.blueBright(`Started Watching: ${normalize(join(process.cwd(), 'src'))}`));
}
