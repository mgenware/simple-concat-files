import * as assert from 'assert';
import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as fsPromises } from 'fs';

const execAsync = promisify(exec);

async function t(args: string[]) {
  await execAsync(`node "./dist/main.js" ${args.join(' ')}`);
}

// Returns a source file path.
function sf(name: string): string {
  return `./tests/data/${name}`;
}

// Returns a dest file path.
function df(name: string): string {
  return `./tests/tmp/${name}`;
}

it('Main', async () => {
  const destFile = df(`${Date.now().toString()}/merged.txt`);
  await t([sf('a.txt'), sf('b.bin'), sf('c.txt'), destFile]);
  assert.strictEqual(await (await fsPromises.readFile(destFile)).toString(), 'a\n\x01\x02\x03c\n');
});
