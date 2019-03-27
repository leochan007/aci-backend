const parse = require('csv-parse/lib/sync')
const Papa = require('papaparse');

const xlsx = require('node-xlsx');

const XLSX = require('xlsx');

const fs = require('fs');
const path = require('path');

function getRecords() {

  var arguments = process.argv.splice(2);

  console.log('arguments:', arguments);

  data_file = '';

  type = 'csv';

  if (arguments.length > 0) {
    data_file = arguments[0];
  }

  if (data_file === '') {
    console.log('no data specified! exit...');
    process.exit(0)
  }

  const tmpType = data_file.substr(data_file.lastIndexOf('.') + 1)
  console.log('tmpType:', tmpType);

  if (tmpType === 'csv' || tmpType === 'json') {
    type = tmpType;
  }

  raw_data = fs.readFileSync(data_file, 'utf-8');

  let records = [];

  if (type === 'json') {
    records = JSON.parse(raw_data);
    if (records.hasOwnProperty('RECORDS')) {
      records = records['RECORDS']
    }
  } else if (type === 'csv') {

    console.log('raw_data:', raw_data);

    /*
    records = xlsx.parse(raw_data);

    records = XLSX.read(raw_data, {type:'buffer'});

    const config = {
      delimiter: "",	// auto-detect
      newline: "",	// auto-detect
      quoteChar: '"',
      escapeChar: '"',
      header: true,
      transformHeader: undefined,
      dynamicTyping: false,
      preview: 0,
      encoding: "utf8",
      worker: false,
      comments: false,
      step: undefined,
      complete: undefined,
      error: undefined,
      download: false,
      downloadRequestHeaders: undefined,
      skipEmptyLines: false,
      chunk: undefined,
      fastMode: undefined,
      beforeFirstChunk: undefined,
      withCredentials: undefined,
      transform: undefined,
      delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP]
    };

    records = Papa.parse(raw_data, config).data;
    */
    records = parse(raw_data, {
      columns: true,
      delimiter: ',',
      from: 1,
      quote: '',
      relax: true,
      trim: true,
      record_delimiter: '\n', // This is an issue, I had to set the \n here as 'auto' wasn't working, nor was 'windows'.  Maybe look at auto-detecting line endings?
      skip_empty_lines: true
    })

  }

  return records;

}

module.exports = {
  getRecords
}
