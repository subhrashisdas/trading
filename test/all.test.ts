import { join } from 'path';
import { readdirSync, statSync } from 'fs';

let files: string[] = [];

function throughDirectory(Directory: string) {
  readdirSync(Directory).forEach((File) => {
    const absolute = join(Directory, File);
    if (statSync(absolute).isDirectory()) {
      return throughDirectory(absolute);
    } else {
      return files.push(absolute);
    }
  });
}

throughDirectory('./test');

for (const file of files) {
  if (!__filename.includes(file) && file.includes('.test.')) {
    const exports = require(join('../', file));
    for (const [key, value] of Object.entries(exports)) {
      it(key, value as any);
    }
  }
}
