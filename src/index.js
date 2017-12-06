import fs from 'mz/fs';
import { URL } from 'url';
import path from 'path';
import process from 'process';

import axios from 'axios';
import cheerio from 'cheerio';
// import Listr from 'listr';

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

const showErrorMessage = (e) => {
  console.log('');
  console.log(e.message);
  console.log('');
};

const savePage = (inputURL, outputPath = process.cwd()) => {
  const pageName = renderPageName(inputURL);
  const assetsFolderName = `${pageName}_files`;
  const assetsFolder = path.resolve(outputPath, assetsFolderName);
  const htmlName = `${pageName}.html`;

  const result = fs.exists(assetsFolder)
    .then((exist) => {
      if (exist) return true;
      return fs.mkdir(assetsFolder);
    })
    .then(() => axios.get(inputURL))
    .then((response) => {
      const $ = cheerio.load(response.data);
      const $assets = $('[src]')
        .add('[href]')
        .filter((i, el) => {
          const targets = ['link', 'script', 'img'];
          return targets.indexOf(el.tagName) !== -1;
        });

      const getPromisesCol = (col, acc = [], idx = 0) => {
        if (idx === col.length) return acc;

        const el = col[idx];
        const assetAttr = $(el).attr('src') ? 'src' : 'href';
        const url = $(el).attr(assetAttr);
        const assetName = renderAssetName(url, inputURL);
        const resolvedURL = new URL(url, inputURL);

        const promise = axios({
          method: 'get',
          url: resolvedURL.toString(),
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
              $(el).attr(assetAttr, `${assetsFolderName}${path.sep}${assetName}`);
            },
            showErrorMessage,
          );

        return getPromisesCol(col, [...acc, promise], idx + 1);
      };
      const promisesCol = getPromisesCol($assets);

      const pathToFile = path.join(outputPath, htmlName);
      return Promise.all(promisesCol)
        .then(() => fs.writeFile(pathToFile, $.html()));
    })
    .then(() => {
      console.log(`Page was downloaded as '${htmlName}'`);
    })
    .catch((e) => {
      showErrorMessage(e);
      throw e;
    });

  return result;
};

export default savePage;
