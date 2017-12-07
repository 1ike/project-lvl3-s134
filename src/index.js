import fs from 'mz/fs';
import { URL } from 'url';
import path from 'path';
import process from 'process';

import axios from 'axios';
import cheerio from 'cheerio';
// import Listr from 'listr';
import debug from 'debug';

const log = {};
log.result = debug('page-loader:result');
log.asset = debug('page-loader:asset');
log.errors = debug('page-loader:errors');

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

const showMessage = (message, type = 'result') => {
  log[type](message);
  console.log('');
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

const getPromisesCol = (args, acc = [], idx = 0) => {
  const {
    $,
    assets,
    inputURL,
    assetsFolder,
    assetsFolderName,
  } = args;

  if (idx === assets.length) return acc;

  const { attr, elem } = assets[idx];
  const url = $(elem).attr(attr);
  const assetName = renderAssetName(url, inputURL);
  const resolvedURL = (new URL(url, inputURL)).toString();

  const promise = axios({
    method: 'get',
    url: resolvedURL,
    responseType: 'stream',
  })
    .then((res) => {
      const assetPath = path.resolve(
        assetsFolder,
        assetName,
      );
      return res.data.pipe(fs.createWriteStream(assetPath));
    })
    .then(
      () => {
        const link = `${assetsFolderName}${path.sep}${assetName}`;
        $(elem).attr(attr, link);
        showMessage(`Loaded file: ${resolvedURL}`, 'asset');
      },
      showMessage,
    );

  return getPromisesCol(args, [...acc, promise], idx + 1);
};


export default (inputURL, outputPath = process.cwd()) => {
  let $;
  const pageName = renderPageName(inputURL);
  const assetsFolderName = `${pageName}_files`;
  const assetsFolder = path.resolve(outputPath, assetsFolderName);
  const htmlName = `${pageName}.html`;
  const pathToFile = path.join(outputPath, htmlName);

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

      const args = {
        $,
        assets,
        inputURL,
        assetsFolder,
        assetsFolderName,
      };
      const promisesCol = getPromisesCol(args);

      return Promise.all(promisesCol);
    })
    .then(() => {
      fs.writeFile(pathToFile, $.html());
    })
    .then(() => {
      const message = `Page was downloaded as '${htmlName}'`;
      showMessage(message);
      // process.exitCode = 0;
    })
    .catch((e) => {
      showMessage(e.message, 'errors');
      // process.exitCode = 1;
      throw e;
    });
};
