import { WriteToFile, DeleteFile } from './utils';
import { exec } from 'child_process';
import { watch } from 'chokidar';
import chalk from 'chalk';

import { normalize, join } from 'path';

export async function Watch() {
  exec('tsc -w', (err, stOut, stErr) => {
    console.log('WATCH', stOut);
    if (err) console.log(err);
  });

  watch('src').on('all', async (type, path, stats) => {
    switch (type) {
      case 'change':
        if (path.endsWith('.ts')) {
          WriteToFile(path, chalk.green(`Updated ${path} - THE_END ms`));
        }
        break;
      case 'unlink':
        if (path.endsWith('.ts')) {
          DeleteFile(path);
        }
        break;
    }
  });
  console.log(chalk.blueBright(`Started Watching: ${normalize(join(process.cwd(), 'src'))}`));
}
