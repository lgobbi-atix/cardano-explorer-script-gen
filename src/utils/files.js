const fs = require('fs').promises;
const path = require('path');

const MAX_BLOCK_COUNT = 21600;
const MAX_LOVELACE_AMOUNT = 45000000000000000;

const now = new Date().getTime();

// eslint-disable-next-line complexity
const validateEpoch = (epoch, index) => {
  const epochNo = index + 1;
  const { blockCount, transactionCount, totalFeesPaid, totalOutput, utxoStateAmount } = epoch;
  if (blockCount === undefined) {
    throw new Error(`Epoch number ${epochNo} doesn't have a blockCount field`);
  }
  if (transactionCount === undefined) {
    throw new Error(`Epoch number ${epochNo} doesn't have a transactionCount field`);
  }
  if (blockCount < 0 || blockCount > MAX_BLOCK_COUNT) {
    throw new Error(`Epoch number ${epochNo} has an invalid blockCount (${blockCount}).
        Must be a value between 0 and ${MAX_BLOCK_COUNT}`);
  }
  if (totalFeesPaid && (totalFeesPaid < 0 || totalFeesPaid > MAX_LOVELACE_AMOUNT)) {
    throw new Error(`Epoch number ${epochNo} has an invalid totalFeesPaid (${totalFeesPaid}).
      Must be a value between 0 and ${MAX_LOVELACE_AMOUNT}`);
  }
  if (totalOutput && (totalOutput < 0 || totalOutput > MAX_LOVELACE_AMOUNT)) {
    throw new Error(`Epoch number ${epochNo} has an invalid totalOutput (${totalOutput}).
      Must be a value between 0 and ${MAX_LOVELACE_AMOUNT}`);
  }
  if (utxoStateAmount && (utxoStateAmount < 0 || utxoStateAmount > transactionCount)) {
    throw new Error(`Epoch number ${epochNo} has an invalid utxoStateAmount (${utxoStateAmount}).
      Must be a value between 0 and ${transactionCount}`);
  }
};

const readFile = async file => {
  const fileHandle = await fs.open(file);
  const fileContents = await fileHandle.readFile();
  return JSON.parse(fileContents);
};

const parseInput = async inputFile => {
  const input = await readFile(inputFile);
  const { epochs } = input;
  if (!epochs || epochs.length === 0) {
    throw new Error('No data for epochs in input file');
  }
  epochs.forEach((epoch, index) => {
    validateEpoch(epoch, index);
  });
  return epochs;
};

const writeToFile = async (filename, data, outputFolderPath) => {
  const folder = path.join(outputFolderPath, `${now}`);
  await fs.mkdir(folder, { recursive: true });
  const filepath = path.join(folder, filename);
  await fs.writeFile(filepath, data);
  console.log('Generated File in:', filepath);
};

module.exports = {
  readFile: file => readFile(file),
  parseInput: inputFile => parseInput(inputFile),
  writeToFile: (filename, data, outputFolderPath) => writeToFile(filename, data, outputFolderPath)
};
