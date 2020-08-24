const fs = require('fs');
const _ = require('lodash');
const readXlsxFile = require('read-excel-file/node');

async function main(filename) {
  const en = {};
  const ht = {};
  const ru = {};
  const bn = {};
  const ko = {};
  const zh = {};
  const es = {};

  const [, ...rows] = await readXlsxFile(filename);
  rows.forEach((row) => {
    const path = row[0];
    _.set(en, path, row[1]);
    _.set(ht, path, row[2]);
    _.set(ru, path, row[3]);
    _.set(bn, path, row[4]);
    _.set(ko, path, row[5]);
    _.set(zh, path, row[6]);
    _.set(es, path, row[7]);
  });

  return [en, ht, ru, bn, ko, zh, es];
}

main('input.xlsx').then(([en, ht, ru, bn, ko, zh, es]) => {
  // fs.writeFileSync('../src/assets/lang/en.json', JSON.stringify(en, null, 2));
  fs.writeFileSync('../src/assets/lang/ht.json', JSON.stringify(ht, null, 2));
  fs.writeFileSync('../src/assets/lang/ru.json', JSON.stringify(ru, null, 2));
  fs.writeFileSync('../src/assets/lang/bn.json', JSON.stringify(bn, null, 2));
  fs.writeFileSync('../src/assets/lang/ko.json', JSON.stringify(ko, null, 2));
  fs.writeFileSync('../src/assets/lang/zh.json', JSON.stringify(zh, null, 2));
  fs.writeFileSync('../src/assets/lang/es.json', JSON.stringify(es, null, 2));
});
