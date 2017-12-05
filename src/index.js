import fs from 'mz/fs';
import url from 'url';
import path from 'path';
import process from 'process';

import axios from 'axios';
// import cheerio from 'cheerio';
// import Listr from 'listr';

const transformUrlToName = inputURL => inputURL.replace(/[^a-zA-Z0-9]+/g, '-');

const renderName = (inputURL) => {
  const { hostname, pathname } = url.parse(inputURL);
  const stage1 = `${hostname}${pathname}`;
  const stage2 = transformUrlToName(stage1);
  const stage3 = stage2.replace(/-$/g, '');

  return `${stage3}.html`;
};

const savePage = (inputURL, outputPath = process.cwd()) => {
  const name = renderName(inputURL);

  const result = axios.get(inputURL)
    .then((response) => {
      const pathToFile = path.join(outputPath, name);

      return fs.writeFile(pathToFile, response.data);
    })
    .then(() => {
      console.log(`Page was downloaded as '${name}'`);
    })
    .catch((e) => {
      console.log(e.message);
      throw e;
    });

  return result;
};

export default savePage;
