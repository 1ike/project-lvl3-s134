import fs from 'mz/fs';
import url from 'url';
import path from 'path';
import process from 'process';

import axios from 'axios';
// import cheerio from 'cheerio';
// import Listr from 'listr';

const renderName = (inputURL) => {
  const urlObject = url.parse(inputURL);
  const stage1 = `${urlObject.hostname}${urlObject.pathname}`;
  const stage2 = stage1.replace(/[^a-zA-Z0-9]+/g, '-');
  const stage3 = stage2.replace(/-$/g, '');

  return `${stage3}.html`;
};

const savePage = (inputURL, outputPath = process.cwd()) => {
  const name = renderName(inputURL);

  const result = axios.get(inputURL)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(`Expected 200, but was ${response.status} for '${inputURL}'`);
      }

      return response.data;
    })
    .then((html) => {
      const pathToFile = path.join(outputPath, name);

      return fs.writeFile(pathToFile, html);
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
