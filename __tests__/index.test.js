import fs from 'mz/fs';
import os from 'os';
import path from 'path';
import process from 'process';

import nock from 'nock';

import savePage from '../src';


const inputURL = 'https://tpverstak.github.io/';

const dir = path.join(__dirname, '/__fixtures__');
const fixture = 'test.html';

const testFileName = 'tpverstak-github-io.html';
const testFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'test-'));
const pathToFile = path.join(testFolder, testFileName);
const defaultPathToFile = path.join(process.cwd(), testFileName);

afterEach(() => {
  fs.exists(pathToFile)
    .then((exist) => {
      if (exist) fs.unlink(pathToFile);
    })
    .then(() => fs.exists(defaultPathToFile))
    .then((exist) => {
      if (exist) fs.unlink(defaultPathToFile);
    });
});

test('savePage: saving', () => {
  expect.assertions(1);

  return savePage(inputURL, testFolder)
    .then(() => fs.readFile(path.join(dir, fixture), 'utf8'))
    .then((html) => {
      nock(inputURL)
        .get('/')
        .reply(200, html);
      return fs.readFile(pathToFile, 'utf8')
        .then((data) => {
          expect(data).toBe(html);
        });
    });
});

test('savePage: saving default', () => {
  expect.assertions(1);

  return savePage(inputURL)
    .then(() => fs.readFile(path.join(dir, fixture), 'utf8'))
    .then((html) => {
      nock(inputURL)
        .get('/')
        .reply(200, html);
      return fs.readFile(defaultPathToFile, 'utf8')
        .then((data) => {
          expect(data).toBe(html);
        });
    });
});

test('savePage: wrong path', () => {
  const outputPath = '__test__';

  expect.assertions(1);

  return savePage(inputURL, outputPath)
    .then(() => fs.readFile(path.join(dir, fixture), 'utf8'))
    .then((html) => {
      nock(inputURL)
        .get('/')
        .reply(200, html);
      return fs.readFile(path.join(outputPath, testFileName), 'utf8')
        .catch((e) => {
          expect(e.code).toBe('ENOENT');
        });
    });
});
