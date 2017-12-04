#!/usr/bin/env node

import program from 'commander';

import load from '../';

program
  .version('0.0.0')
  .description('Saving page for offline using.')
  .option('-o, --output [path]', 'Path for saving page')
  .arguments('<url>')
  .action(url => load(url, program.output))
  .parse(process.argv);

if (!program.args.length) program.help();
