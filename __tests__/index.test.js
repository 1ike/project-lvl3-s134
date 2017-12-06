import fs from 'mz/fs';
import os from 'os';
import { URL } from 'url';
import path from 'path';
import process from 'process';

import nock from 'nock';
import rimraf from 'rimraf';

import savePage from '../src';


const rmrf = f => new Promise((resolve, reject) => {
  rimraf(f, (e) => {
    if (e) reject(e);
    resolve();
  });
});

const inputURL = 'https://ru.hexlet.io/courses';

const dir = path.join(__dirname, '/__fixtures__');
const inputFixture = 'input.html';
const outputFixture = 'output.html';

const testFileName = 'ru-hexlet-io-courses.html';
const testAssetsFolderName = 'ru-hexlet-io-courses_files';
const defaultPathToFile = path.join(process.cwd(), testFileName);
const defaultAssetsFolder = path.join(process.cwd(), testAssetsFolderName);
let testFolder;
let pathToFile;
let assetsFolder;
let htmlInput;
let htmlOutput;

const savePageWraper = (file, folder) => savePage(inputURL, folder)
  .then(() => fs.readFile(file, 'utf8'))
  .then((data) => {
    expect(data).toBe(htmlOutput);
  });

beforeAll(() => fs.mkdtemp(path.join(os.tmpdir(), 'test-'))
  .then((folder) => {
    testFolder = folder;
    pathToFile = path.join(testFolder, testFileName);
    assetsFolder = path.join(testFolder, testAssetsFolderName);
  })
  .then(() => fs.readFile(path.join(dir, inputFixture), 'utf8'))
  .then((data) => {
    htmlInput = data;
  })
  .then(() => fs.readFile(path.join(dir, outputFixture), 'utf8'))
  .then((data) => {
    htmlOutput = data;
  }));

beforeEach(() => {
  const { origin, pathname } = new URL(inputURL);
  nock(origin).get(pathname).reply(200, htmlInput);
});

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
      // return fs.unlink(defaultPathToFile);
    }
    return false;
  })
  .then(() => rmrf(assetsFolder))
  .then(() => rmrf(defaultAssetsFolder)));

test('savePage: saving', () => {
  expect.assertions(1);

  return savePageWraper(pathToFile, testFolder);
});

test('savePage: saving default', () => {
  expect.assertions(1);

  return savePageWraper(defaultPathToFile);
});

test('savePage: wrong path', () => {
  const outputPath = '__test__';

  expect.assertions(1);

  return savePage(inputURL, outputPath)
    .catch((e) => {
      expect(e.code).toBe('ENOENT');
    });
});


// test('savePage: saving', () => {
//   expect(1).toBe(1);
// });
