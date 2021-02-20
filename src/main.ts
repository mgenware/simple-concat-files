#!/usr/bin/env node
import { promises as fsPromises } from 'fs';
import * as nodepath from 'path';

const args = process.argv.slice(2);
if (!args.length) {
  throw new Error('No input files');
}

const dest = args[args.length - 1];
if (args.length === 1 || !dest) {
  throw new Error('Destination file not specified');
}

const tasks = args.slice(0, args.length - 1).map((f) => fsPromises.readFile(f));
const files = await Promise.all(tasks);
const merged = Buffer.concat(files);

const destDir = nodepath.dirname(dest);
await fsPromises.mkdir(destDir, { recursive: true });
await fsPromises.writeFile(dest, merged);
