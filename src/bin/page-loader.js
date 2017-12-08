#!/usr/bin/env node

import path from 'path';
import program from 'commander';

import load from '../';

const showErrorMessage = (e) => {
  console.error();
  switch (e.code) {
    case 'ENOENT':
      console.error(`No such directory: ${path.dirname(e.path)}`);
      console.error('Check and correct output directory parameter. Or create this directory.');
      break;
    case 'ENOTFOUND':
      console.error(`Server not found for URL: ${e.config.url}`);
      console.error('Check and correct URL parameter.');
      break;
    case 'EACCES':
      console.error(`Check acsess rights for this file or directory: ${e.path}`);
      break;
    default:
      if (e.response && e.response.status) {
        const { status, statusText: text } = e.response;
        console.error(`Status ${status} (${text}): ${e.config.url}`);
      } else {
        console.error(e);
      }
  }
  console.error();
};


program
  .version('0.0.0')
  .description('Saving page for offline using.')
  .option('-o, --output [path]', 'Path for saving page')
  .arguments('<url>')
  .action(url => load(url, program.output)
    .then((htmlName) => {
      console.log();
      console.log(`Page was downloaded as '${htmlName}'`);
      console.log();
      process.exitCode = 0;
    })
    .catch((e) => {
      showErrorMessage(e);
      process.exitCode = 1;
    }))
  .parse(process.argv);

if (!program.args.length) program.help();
