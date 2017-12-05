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
const defaultPathToFile = path.join(process.cwd(), testFileName);
let testFolder;
let pathToFile;
let html;

beforeAll(() => {
  testFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'test-'));
  pathToFile = path.join(testFolder, testFileName);
  return fs.readFile(path.join(dir, fixture), 'utf8')
    .then((data) => {
      html = data;
    });
});

beforeEach(() => nock(inputURL).get('/').reply(200, html));

afterEach(() => fs.exists(pathToFile)
  .then((exist) => {
    if (exist) {
      return fs.unlink(pathToFile);
    }
    return false;
  })
  .then(() => fs.exists(defaultPathToFile))
  .then((exist) => {
    if (exist) {
      return fs.unlink(defaultPathToFile);
    }
    return false;
  }));

test('savePage: saving', () => {
  expect.assertions(1);

  return savePage(inputURL, testFolder)
    .then(() => fs.readFile(pathToFile, 'utf8'))
    .then((data) => {
      expect(data).toBe(html);
    });
});

test('savePage: saving default', () => {
  expect.assertions(1);

  return savePage(inputURL)
    .then(() => fs.readFile(defaultPathToFile, 'utf8'))
    .then((data) => {
      expect(data).toBe(html);
    });
});

test('savePage: wrong path', () => {
  const outputPath = '__test__';

  expect.assertions(1);

  return savePage(inputURL, outputPath)
    .catch((e) => {
      expect(e.code).toBe('ENOENT');
    });
});
