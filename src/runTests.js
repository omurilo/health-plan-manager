import child from 'child_process';
import { readdir } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

function readDirsAndFiles(dir, childDir = '') {
  let dirToSearch;
  if (!dir) {
    dirToSearch = dirname(fileURLToPath(import.meta.url));
  } else {
    dirToSearch = resolve(dirname(fileURLToPath(import.meta.url)), childDir, dir.name);
  }

  const readDirs = promisify(readdir);
  return readDirs(dirToSearch, { withFileTypes: true })
    .then((files) => {
      return files.map((file) => verifyIsDirOrFile(file, dirToSearch));
    });
}

function verifyIsDirOrFile(item, dir) {
  if (item.isFile() && item.name.endsWith('.spec.js')) {
    console.log('Running test:', resolve(dir, item.name));
    return new Promise((res) => {
      child.exec(`node --experimental-json-modules ${resolve(dir, item.name)}`, function (error, stdout, stderr) {
        if (error) {
          console.log(error.stack);
          console.log('Error code: ' + error.code);
          console.log('Signal received: ' + error.signal);
        }
        if (stderr) {
          console.log('Child Process STDERR: ' + stderr);
        }
        if (stdout) {
          console.log('Child Process STDOUT: ' + stdout);
        }
      })
    });
  }

  if (item.isDirectory()) {
    return readDirsAndFiles(item, dir)
  }
}

readDirsAndFiles()