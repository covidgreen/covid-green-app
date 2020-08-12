'use strict';

const fs = require('fs');
const _ = require('lodash');
const Excel = require('exceljs');

function process(ws, path, enObj, gaObj) {
  if (!_.isObject(enObj)) {
    const enVal = enObj.replace(/\n/g, '\\n');
    const gaVal = _.get(gaObj, path, '');
    ws.addRow({
      context: path,
      english: enVal,
      gaeilge: (gaVal && gaVal.replace(/\n/g, '\\n')) || ''
    });
    return;
  }

  Object.keys(enObj).forEach((key) => {
    process(ws, path === '' ? key : `${path}.${key}`, enObj[key], gaObj);
  });
}

async function generateFile() {
  const enRaw = await fs.promises.readFile('../assets/lang/en.json');
  const gaRaw = await fs.promises.readFile('../assets/lang/ga.json');
  const en = JSON.parse(enRaw);
  const ga = JSON.parse(gaRaw);

  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('Translations');

  worksheet.columns = [
    {header: 'Context', key: 'context'},
    {header: 'English', key: 'english'},
    {header: 'Gaeilge', key: 'gaeilge'}
  ];

  process(worksheet, '', en, ga);

  await workbook.xlsx.writeFile('output.xlsx');
}

generateFile();
