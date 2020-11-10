const fs = require('fs');
const _ = require('lodash');
const readXlsxFile = require('read-excel-file/node');

const rtlCodes = ['ar', 'yi'];
const langCodes = ['en', ...rtlCodes, 'ht', 'ru', 'bn', 'ko', 'zh', 'es'];

const rtlMarkerChar = '‏';
const ltrMarkerChar = '‎';

async function main(filename) {
  const langText = langCodes.map((code) => {
    const path = `../src/assets/lang/${code}.json`;
    return fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
  });

  const [, ...rows] = await readXlsxFile(filename);
  rows.forEach((row) => updateRow(row, langText));

  return langText;
}

function updateRow(row, languages) {
  const [path, ...textColumns] = row;
  languages.forEach((lang, index) => {
    const langCode = langCodes[index];
    const textCell = textColumns[index];
    if (textCell) {
      const isRTL = rtlCodes.includes(langCode);
      _.set(lang, path, fixText(textCell, isRTL));
    }
  });
}

function fixText(input = '', isRTL = false) {
  let fixedText = input;

  // Fix any Windows-style "\r\n" line breaks
  fixedText = fixedText.replace(/\r/g, '');

  // Fix double-escaped and/or space-separated line breaks e.g. "\\ n"
  fixedText = fixedText.replace(/(\\ *)+n/g, '\n');

  // Fix translated "tel:" in Markdown tel links e.g. [Call 911](电话: 911)
  fixedText = fixedText.replace(
    /(?<=\[[^\n]+\]) *\(\S+ *: *(\d+) *\)/g,
    '(tel:$1)'
  );

  // Fix gaps in Markdown links e.g. [Some text] (http://example.com)
  fixedText = fixedText.replace(/(?<=\[[^\n]+\]) +(?=\(\S+?\))/g, '');

  if (isRTL) {
    // Flip and fix any backwards links e.g. (http://example.com) [Some text]
    fixedText = fixedText.replace(/(\(\S+?\)) *(\[[^\n]+\])/g, '$2$1');

    // Force RTL for lines in RTL langs starting with LTR, e.g. "COVID تنبيه NY"
    // except isolated URLs and Markdown ordered list numbering e.g. "12. تنبيه"
    fixedText = fixedText.replace(
      /(?<=^|\n)(?!http)(?![0-9]+\. )(?=[a-zA-Z0-9[(])/g,
      rtlMarkerChar
    );

    // Use LTR in inline markdown links so [] and () segments don't get split
    fixedText = fixedText.replace(
      /(?<=\S )(?=\[[^\n]+\]\(\S+?\))/g,
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
