import { readdirSync, statSync } from 'fs';
import * as path from 'path';

let files: string[] = [];

function throughDirectory(Directory: string) {
  readdirSync(Directory).forEach(File => {
    const Absolute = path.join(Directory, File);
    if (statSync(Absolute).isDirectory()) {
      return throughDirectory(Absolute);
    } else {
      return files.push(Absolute);
    }
  });
}

throughDirectory('./test');

for (const file of files) {
  if (!__filename.includes(file)) {
    console.log(file);
    const exports = require(path.join('../', file));
    for (const [key, value] of Object.entries(exports)) {
      console.log(key);
      it(key, value as any);
    }
  }
}
