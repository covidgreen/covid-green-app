const fs = require('fs');
const _ = require('lodash');
const readXlsxFile = require('read-excel-file/node');

const rtlCodes = ['yi'];
const langCodes = ['en', 'ht', 'ru', 'bn', 'ko', 'zh', 'es', ...rtlCodes];

const rtlMarkerChar = '‏';
const ltrMarkerChar = '‎';

async function main(filename) {
  const langText = langCodes.map((code) =>
    JSON.parse(fs.readFileSync(`../src/assets/lang/${code}.json`))
  );

  const [, ...rows] = await readXlsxFile(filename);
  rows.forEach((row) => updateRow(row, langText));

  return langText;
}

function updateRow(row, languages) {
  const [path, ...textColumns] = row;
  languages.forEach((lang, index) => {
    const langCode = langCodes[index];
    const textCell = textColumns[index];
    const isRTL = rtlCodes.includes(langCode);
    _.set(lang, path, fixText(textCell, isRTL));
  });
}

function fixText(input = '', isRTL = false) {
  let fixedText = input;

  // Fix double-escaped and/or space-separated line breaks
  fixedText = fixedText.replace(/(\\ *)+n/g, '\n');

  // Fix gaps in links e.g. [Some text] (http://example.com)
  fixedText = fixedText.replace(/(?<=\[[^\n]+\]) +(?=\(\S+?\))/g, '');

  if (isRTL) {
    // Force RTL for lines in RTL langs starting with LTR, e.g. "COVID تنبيه NY"
    fixedText = fixedText.replace(
      /(?<=^|\n)(?!http)(?=[a-zA-Z0-9[(])/g,
      rtlMarkerChar
    );

    // Use LTR in inline markdown links so [] and () segments don't get split
    fixedText = fixedText.replace(
      /(?<=\w )(?=\[[^\n]+\]\(\S+?\))/g,
      ltrMarkerChar
    );
  }
  return fixedText;
}

main('input.xlsx').then((langText) => {
  langText.forEach((text, index) => {
    const langCode = langCodes[index];
    fs.writeFileSync(
      `../src/assets/lang/${langCode}.json`,
      JSON.stringify(text, null, 2)
    );
  });
});
