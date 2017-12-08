import fs from 'mz/fs';
import { URL } from 'url';
import path from 'path';
import process from 'process';

import axios from 'axios';
import cheerio from 'cheerio';
import Listr from 'listr';
import debug from 'debug';

import rmrf from './lib';

const log = debug('page-loader:log');

const transformUrlToName = inputURL => inputURL.replace(/[^a-zA-Z0-9]+/g, '-');

const renderPageName = (inputURL) => {
  const { hostname, pathname } = new URL(inputURL);
  const stage1 = `${hostname}${pathname}`;
  const stage2 = transformUrlToName(stage1);
  const stage3 = stage2.replace(/-$/g, '');

  return stage3;
};

const renderAssetName = (url, inputURL) => {
  const { pathname } = new URL(url, inputURL);
  const { dir, base } = path.parse(pathname);
  const stage1 = transformUrlToName(dir);
  // const stage2 = stage1.replace(/^-/g, '');

  return `${stage1}-${base}`;
};

const prepareAssetsCol = ($, rules) => {
  const assets = rules.reduce((acc, item) => {
    const { attr, tags } = item;

    const $assets = $(`[${attr}]`)
      .filter((i, el) => tags.indexOf(el.tagName) !== -1);

    const addToCol = ($col, col = [], idx = 0) => {
      if (idx === $col.length) return col;
      const val = { attr, elem: $col[idx] };

      return addToCol($col, [...col, val], idx + 1);
    };

    return [...acc, ...addToCol($assets)];
  }, []);

  return assets;
};

const getTasks = (args) => {
  const {
    $,
    assets,
    inputURL,
    assetsFolder,
    assetsFolderName,
  } = args;

  return assets.reduce((tasks, asset) => {
    const { attr, elem } = asset;
    const url = $(elem).attr(attr);
    const assetName = renderAssetName(url, inputURL);
    const resolvedURL = (new URL(url, inputURL)).toString();
    const assetPath = path.resolve(assetsFolder, assetName);

    const promise = rmrf(assetPath)
      .then(() => axios({
        method: 'get',
        url: resolvedURL,
        responseType: 'stream',
      }))
      .then((res) => {
        const writableStream = fs.createWriteStream(assetPath);
        const getStreamPromise = (read, write) => new Promise((resolve, reject) => {
          write.on('error', reject);
          write.on('finish', () => {
            const link = `${assetsFolderName}/${assetName}`;
            $(elem).attr(attr, link);
            resolve();
          });
          read.pipe(write);
        });
        return getStreamPromise(res.data, writableStream);
      });

    return tasks.add({
      title: resolvedURL,
      task: () => promise,
    });
  }, new Listr({ concurrent: 100, exitOnError: false }));
};


export default (inputURL, outputPath = process.cwd()) => {
  let $;
  const pageName = renderPageName(inputURL);
  const assetsFolderName = `${pageName}_files`;
  const assetsFolder = path.resolve(outputPath, assetsFolderName);
  const htmlName = `${pageName}.html`;
  const pathToFile = path.join(outputPath, htmlName);
  log('html will be downloaded to file: ', pathToFile);
  log('assets folder: ', assetsFolder);

  return fs.exists(assetsFolder)
    .then((exist) => {
      if (exist) return true;
      return fs.mkdir(assetsFolder);
    })
    .then(() => axios.get(inputURL))
    .then((response) => {
      $ = cheerio.load(response.data);

      const assetsRules = [
        { attr: 'src', tags: ['img', 'script'] },
        { attr: 'href', tags: ['link'] },
      ];
      const assets = prepareAssetsCol($, assetsRules);
      log('Assets collection length: ', assets.length);
      const args = {
        $,
        assets,
        inputURL,
        assetsFolder,
        assetsFolderName,
      };
      const tasks = getTasks(args);
      const { _tasks } = tasks;
      log('Promises collection length: ', _tasks.length);
      return tasks.run().catch(() => true);
    })
    .then(() => rmrf(pathToFile))
    .then(() => fs.writeFile(pathToFile, $.html()))
    .then(() => htmlName);
};
