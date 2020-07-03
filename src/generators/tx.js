const { txGen, txOutGen, txInGen } = require('../models');
const {
  helpers: { randomNumber }
} = require('../utils/data-types');

exports.generateTx = (blockId, fee, outSum) => txGen.generate(blockId, { fee, outSum });

exports.generateTxIns = ({ txs, txOuts, utxoCount }) => {
  const epochsAmount = txs.length;
  const txIns = [];
  for (let currentEpoch = 0; currentEpoch < epochsAmount; currentEpoch++) {
    const txOutsWithTxIns = [...txOuts[currentEpoch]];
    const txsWithTxIns = [...txs];
    let i = 0;
    while (i < txOuts[currentEpoch].length - utxoCount[currentEpoch]) {
      const epochIndex = randomNumber(0, epochsAmount - 1);
      const txIndex = randomNumber(0, txOutsWithTxIns.length - 1);
      // Pick a tx that happened after that txOut
      const [tx] = txsWithTxIns[epochIndex].splice(
        randomNumber(txIndex, txsWithTxIns.length - 1),
        1
      );
      // May be out of bounds
      if (!tx) continue;
      // Pick a random txOut
      const [txOut] = txOutsWithTxIns.splice(txIndex, 1);
      if (!txIns[currentEpoch]) txIns[currentEpoch] = [];
      txIns[currentEpoch].push(txInGen.generate(tx.id, txOut.id, txOut.index));
      i++;
    }
  }

  return txIns;
};

exports.generateTxOut = txid => txOutGen.generate(txid);
