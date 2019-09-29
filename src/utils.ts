import { readdir, stat, readFile, outputFile, unlink } from 'fs-extra';
import { resolve, relative, basename } from 'path';
import { transformSync } from '@babel/core';
import options from './options';
import chalk from 'chalk';

export function Walk(dir: string) {
  return new Promise<string[]>((_resolve, reject) => {
    let results: string[] = [];
    readdir(dir, function(err, list) {
      if (err) return reject(err);
      let pending = list.length;
      let completed = true;
      if (!pending) {
        return _resolve(list);
      }
      list.forEach(function(file) {
        file = resolve(dir, file);
        stat(file, async function(err, stat) {
          if (err) return reject(err);
          if (stat && stat.isDirectory()) {
            completed = false;
            const a = await Walk(file);
            results.push(...a);
            if (!--pending) {
              return _resolve(results);
            }
          } else {
            results.push(file);
            if (!--pending && completed) {
              return _resolve(results);
            }
          }
        });
      });
    });
  });
}

export async function WriteToFile(path: string, msg: string | null) {
  const now = process.hrtime.bigint();
  const file = await read(path);
  const name = basename(path);
  const transformed = transformSync(file.toString(), {
    plugins: ['@babel/plugin-transform-typescript'],
    filename: name,
    minified: options.minified
  });
  const relativeOutPath = getPath(path, 'dist');
  if (transformed !== null && transformed.code !== undefined && transformed.code !== null) {
    await write(relativeOutPath.concat('.js'), transformed.code).catch((err: any) => console.log(err));
  }
  if (msg !== null) {
    console.log(msg.replace('THE_END', ((process.hrtime.bigint() - now) / BigInt(1e6)).toString()));
  }
}
export function DeleteFile(path: string) {
  const now = process.hrtime.bigint();
  const relativeOutPath = getPath(path, 'dist');
  setTimeout(() => {
    unlink(relativeOutPath.concat('.js'))
      .then(() => {
        console.log(
          chalk.red(`Deleted ${relativeOutPath.concat('.js')} - ${((process.hrtime.bigint() - now) / BigInt(1e6)).toString()} ms`)
        );
      })
      .catch(err => console.log(chalk.yellowBright('DELETED FAIL', err)));
    unlink(relativeOutPath.concat('.d.ts'))
      .then(() =>
        console.log(
          chalk.red(`Deleted ${relativeOutPath.concat('.d.ts')} - ${((process.hrtime.bigint() - now) / BigInt(1e6)).toString()} ms`)
        )
      )
      .catch(err => console.log(chalk.yellowBright('DELETED FAIL', err)));
  }, 0);
}

function read(dir: string) {
  return new Promise<Buffer>((_resolve, reject) => {
    readFile(dir, (err, data) => {
      if (err) reject(err);
      _resolve(data);
    });
  });
}
function write(dir: string, data: string) {
  return new Promise<Buffer>((_resolve, reject) => {
    outputFile(dir, data, err => {
      if (err) reject(err);
      _resolve();
    });
  });
}
function getPath(dir: string, newFolder: string) {
  if (process.platform === 'linux') {
    return relative('./', dir)
      .replace(/^[.\w-]*[\/]/, `${newFolder}/`)
      .replace(/\.[\w]*$/, '');
  } else if (process.platform === 'win32') {
    return relative('./', dir)
      .replace(/^[.\w-]*[\\]/, `${newFolder}\\`)
      .replace(/\.[\w]*$/, '');
  } else {
    throw console.log(chalk.red('Platform not Supported'));
  }
}
