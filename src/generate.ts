import { failure } from './messages';
import { write } from './utils';
import { join } from 'path';

export async function GenerateFiles(args: string[]) {
  if (args[1]) {
    if (args[1] === 's' || args[1] === 'script') {
      if (args[2]) {
        await write(join('src', args[2].endsWith('ts') ? args[2] : args[2].concat('.ts')), '').catch((err: any) => console.log(err));
        return;
      } else {
        failure('Argument PATH required.');
      }
    }
    if (args[1] === 'c' || args[1] === 'component') {
      if (args[2]) {
        await write(join('src/components', args[2].endsWith('vue') ? args[2] : args[2].concat('.vue')), '').catch((err: any) =>
          console.log(err)
        );
        return;
      } else {
        failure('Argument PATH required.');
      }
    }
    if (args[1].endsWith('ts')) {
      await write(join('src', args[1]), '').catch((err: any) => console.log(err));
      return;
    }
    if (args[1].endsWith('vue')) {
      await write(join('src', args[1]), '').catch((err: any) => console.log(err));
      return;
    }
  } else {
    failure('Argument PATH or TYPE required.');
  }
}
