const { generateEpoch } = require('./epoch');
const { generateTx } = require('./tx');
const { generateBlock } = require('./block');

module.exports = {
  generateEpoch,
  generateTx,
  generateBlock
};
