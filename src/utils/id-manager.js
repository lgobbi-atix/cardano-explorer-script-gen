const fs = require('fs');
const path = require('path');
const settings = require('../../settings.json');
const initialSettings = require('../static-data/initial-settings.json');
const { readFile } = require('./files');

const SETTINGS_PATH = '../../settings.json';

const getNextId = setting => {
  const current = settings[setting];
  settings[setting] = current + 1;
  return current;
};

const resetSettings = () => {
  const initial = JSON.stringify(initialSettings);
  fs.writeFile(path.join(__dirname, SETTINGS_PATH), initial, err => {
    if (err) throw err;
    console.log('Settings Reset OK', initial);
  });
};

const updateSettings = () => {
  const updated = JSON.stringify(settings);
  fs.writeFile(path.join(__dirname, SETTINGS_PATH), updated, err => {
    if (err) throw err;
    console.log('Updated Settings', updated);
  });
};

const overwriteSettings = async file => {
  const overwrite = await readFile(file);
  fs.writeFile(path.join(__dirname, SETTINGS_PATH), JSON.stringify(overwrite), err => {
    if (err) throw err;
    console.log('Settings Overwritten OK', overwrite);
  });
};

const printSettings = () => {
  console.log(settings);
};

module.exports = {
  getNextEpochId: () => getNextId('nextEpochId'),
  getNextBlockId: () => getNextId('nextBlockId'),
  getNextTxId: () => getNextId('nextTxId'),
  getNextTxInId: () => getNextId('nextTxInId'),
  getNextTxOutId: () => getNextId('nextTxOutId'),
  updateSettings: () => updateSettings(),
  resetSettings: () => resetSettings(),
  overwriteSettings: file => overwriteSettings(file),
  printSettings: () => printSettings()
};
