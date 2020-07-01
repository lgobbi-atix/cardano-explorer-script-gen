#!/usr/bin/env node

const path = require('path');
const pgp = require('pg-promise');
const { blockGen, epochGen, txGen, txInGen, txOutGen } = require('./src/models');
const { generateEpoch } = require('./src/generators');

const {
  updateSettings,
  resetSettings,
  printSettings,
  overwriteSettings
} = require('./src/utils/id-manager');
const { parseInput, writeToFile } = require('./src/utils/files');
const { argv } = require('./src/cli-config');

const generateAll = async (inputFile, outputFolder) => {
  const inputFilepath = path.resolve(inputFile);
  const input = await parseInput(inputFilepath);
  const outputFolderPath = path.resolve(outputFolder);

  const epochs = input.map(epoch => generateEpoch(epoch));

  const epochQueries = epochs.map(epoch => {
    const { query, values } = epochGen.buildQuery(epoch);
    return pgp.as.format(query, values);
  });
  await writeToFile('epochs.sql', epochQueries.join('\n'), outputFolderPath);

  const blocks = epochs.flatMap(epoch => epoch.blocks);
  const blockQueries = blocks.map(block => {
    const { query, values } = blockGen.buildQuery(block);
    return pgp.as.format(query, values);
  });
  await writeToFile('blocks.sql', blockQueries.join('\n'), outputFolderPath);

  const txs = blocks.flatMap(block => block.txs);
  const txQueries = txs.map(tx => {
    const { query, values } = txGen.buildQuery(tx);
    return pgp.as.format(query, values);
  });
  const txOuts = blocks.flatMap(block => block.txOuts);
  const txOutQueries = txOuts.map(tx => {
    const { query, values } = txOutGen.buildQuery(tx);
    return pgp.as.format(query, values);
  });
  const txIns = blocks.flatMap(block => block.txIns);
  const txInQueries = txIns.map(tx => {
    const { query, values } = txInGen.buildQuery(tx);
    return pgp.as.format(query, values);
  });
  await writeToFile('txs.sql', txQueries.join('\n'), outputFolderPath);
  await writeToFile('tx_outs.sql', txOutQueries.join('\n'), outputFolderPath);
  await writeToFile('tx_ins.sql', txInQueries.join('\n'), outputFolderPath);

  updateSettings();
};

const start = () => {
  if (argv._.includes('generate')) {
    const inputFile = argv.in;
    const outputFolder = argv.out;
    generateAll(inputFile, outputFolder)
      .then(() => console.log('Finished!'))
      .catch(error => console.log(error));
    return;
  }

  if (argv._.includes('overwrite-ids')) {
    const file = argv.in;
    overwriteSettings(file)
      .then(() => console.log('Finished!'))
      .catch(error => console.log(error));
    return;
  }

  if (argv._.includes('reset-ids')) {
    resetSettings();
    console.log('Finished!');
    return;
  }

  if (argv._.includes('show-ids')) {
    printSettings();
  }
};

start();
