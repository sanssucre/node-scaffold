const bluebird = require('bluebird');
const path = require('path');
const rimraf = require('rimraf');

const deleteFolder = bluebird.promisify(rimraf);

Promise.resolve()
  .then(() => { console.log('cleaning.. .nyc_output'); })
  .then(() => deleteFolder(path.resolve(__dirname, '../.nyc_output')))
  .then(() => { console.log('cleaning.. coverage'); })
  .then(() => deleteFolder(path.resolve(__dirname, '../coverage')))
  .then(() => { console.log('cleaning.. .jsdoc'); })
  .then(() => deleteFolder(path.resolve(__dirname, '../.jsdoc')))
  .then(() => { console.log('done'); })
  .catch((err) => { console.log('Unexpected error', err); });
