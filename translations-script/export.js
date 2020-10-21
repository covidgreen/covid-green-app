'use strict';

const fs = require('fs');
const _ = require('lodash');
const Excel = require('exceljs');

function process(ws, path, en, ht, ru, bn, ko, zh, es, yi) {
  if (!_.isObject(en)) {
    const enVal = en.replace(/\n/g, '\\n');
    const htVal = _.get(ht, path, '');
    const ruVal = _.get(ru, path, '');
    const bnVal = _.get(bn, path, '');
    const koVal = _.get(ko, path, '');
    const zhVal = _.get(zh, path, '');
    const esVal = _.get(es, path, '');
    const yiVal = _.get(yi, path, '');

    ws.addRow({
      context: path,
      english: enVal,
      haitian: htVal,
      russian: ruVal,
      bengali: bnVal,
      korean: koVal,
      chinese: zhVal,
      spanish: esVal,
      yiddish: yiVal
    });
    return;
  }

  Object.keys(en).forEach((key) => {
    process(
      ws,
      path === '' ? key : `${path}.${key}`,
      en[key],
      ht,
      ru,
      bn,
      ko,
      zh,
      es,
      yi
    );
  });
}

async function generateFile() {
  const enRaw = await fs.promises.readFile('../src/assets/lang/en.json');
  const htRaw = await fs.promises.readFile('../src/assets/lang/ht.json');
  const bnRaw = await fs.promises.readFile('../src/assets/lang/bn.json');
  const ruRaw = await fs.promises.readFile('../src/assets/lang/ru.json');
  const koRaw = await fs.promises.readFile('../src/assets/lang/ko.json');
  const zhRaw = await fs.promises.readFile('../src/assets/lang/zh.json');
  const esRaw = await fs.promises.readFile('../src/assets/lang/es.json');
  const yiRaw = await fs.promises.readFile('../src/assets/lang/yi.json');

  const en = JSON.parse(enRaw);
  const ht = JSON.parse(htRaw);
  const bn = JSON.parse(bnRaw);
  const ru = JSON.parse(ruRaw);
  const ko = JSON.parse(koRaw);
  const zh = JSON.parse(zhRaw);
  const es = JSON.parse(esRaw);
  const yi = JSON.parse(yiRaw);

  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('Translations');

  worksheet.columns = [
    {header: 'Context', key: 'context'},
    {header: 'English', key: 'english'},
    {header: 'Haitian', key: 'haitian'},
    {header: 'Russian', key: 'russian'},
    {header: 'Bengali', key: 'bengali'},
    {header: 'Korean', key: 'korean'},
    {header: 'Chinese', key: 'chinese'},
    {header: 'Spanish', key: 'spanish'},
    {header: 'Yiddish', key: 'yiddish'}
  ];

  process(worksheet, '', en, ht, ru, bn, ko, zh, es, yi);

  await workbook.xlsx.writeFile('output.xlsx');
}

generateFile();
