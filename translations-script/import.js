const fs = require('fs');
const _ = require('lodash');
const readXlsxFile = require('read-excel-file/node');

async function main(filename) {
  const en = {};
  const ga = {};

  const [, ...rows] = await readXlsxFile(filename);
  rows.forEach((row) => {
    const path = row[0];
    _.set(en, path, row[1]);
    _.set(ga, path, row[2]);
  });

  return [en, ga];
}

main('input.xlsx').then(([en, ga]) => {
  fs.writeFileSync('en.json', JSON.stringify(en, null, 2));
  fs.writeFileSync('ga.json', JSON.stringify(ga, null, 2));
});
