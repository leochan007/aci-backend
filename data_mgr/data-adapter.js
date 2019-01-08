const parse = require('csv-parse/lib/sync')

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
    records = parse(raw_data, {
      columns: true,
      delimiter: ',',
      relax: true,
      rowDelimiter: '\n', // This is an issue, I had to set the \n here as 'auto' wasn't working, nor was 'windows'.  Maybe look at auto-detecting line endings?
      skip_empty_lines: true
    })
  }

  return records;

}

module.exports = {
  getRecords
}
