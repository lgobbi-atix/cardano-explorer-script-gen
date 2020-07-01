const { txGen, txOutGen, txInGen } = require('../models');

exports.generateTx = (blockId, fee, outSum) => txGen.generate(blockId, { fee, outSum });

exports.generateTxIn = (txInId, txOutId, txoutIndex) =>
  txInGen.generate(txInId, txOutId, txoutIndex);

exports.generateTxOut = txid => txOutGen.generate(txid);
