'use strict';

const fs = require('fs');
const _ = require('lodash');

function process(source, target, output, path) {
  if (!_.isObject(source)) {
    const val = _.get(target, path);
    if (val) {
      _.set(output, path, val);
    }
    return;
  }

  Object.keys(source).forEach((key) => {
    process(source[key], target, output, path === '' ? key : `${path}.${key}`);
  });
}

async function cleanLangFile(sourceFile, targetFile) {
  const srcRaw = fs.promises.readFile(`../assets/lang/${sourceFile}.json`);
  const source = JSON.parse(srcRaw);

  const targetRaw = await fs.promises.readFile(
    `../assets/lang/${targetFile}.json`
  );
  const target = JSON.parse(targetRaw);

  const output = {};
  process(source, target, output, '');

  fs.writeFileSync(
    `../assets/lang/${targetFile}.json`,
    JSON.stringify(output, null, 2)
  );
}

cleanLangFile('en', 'ga');
