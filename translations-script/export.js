'use strict';

const fs = require('fs');
const _ = require('lodash');
const Excel = require('exceljs');

function process(ws, path, en, ht, ru, bn, ko, zh) {
  if (!_.isObject(en)) {
    const enVal = en.replace(/\n/g, '\\n');
    const htVal = _.get(ht, path, '');
    const ruVal = _.get(ru, path, '');
    const bnVal = _.get(bn, path, '');
    const koVal = _.get(ko, path, '');
    const zhVal = _.get(zh, path, '');

    ws.addRow({
      context: path,
      english: enVal,
      haitian: htVal,
      russian: ruVal,
      bengali: bnVal,
      korean: koVal,
      chinese: zhVal
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
      zh
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

  const en = JSON.parse(enRaw);
  const ht = JSON.parse(htRaw);
  const bn = JSON.parse(bnRaw);
  const ru = JSON.parse(ruRaw);
  const ko = JSON.parse(koRaw);
  const zh = JSON.parse(zhRaw);

  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('Translations');

  worksheet.columns = [
    {header: 'Context', key: 'context'},
    {header: 'English', key: 'english'},
    {header: 'Haitian', key: 'haitian'},
    {header: 'Russian', key: 'russian'},
    {header: 'Bengali', key: 'bengali'},
    {header: 'Korean', key: 'korean'},
    {header: 'Chinese', key: 'chinese'}
  ];

  process(worksheet, '', en, ht, ru, bn, ko, zh);

  await workbook.xlsx.writeFile('output.xlsx');
}

generateFile();
