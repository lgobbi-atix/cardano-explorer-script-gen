const { txGen, txOutGen, txInGen } = require('../models');
const {
  helpers: { randomNumber }
} = require('../utils/data-types');

const markTxOutsWithoutTxIns = ({ txOuts, txIns }) => {
  const markedTxOutsWithoutTxsIn = [];
  const epochsAmount = txOuts.length;
  const txInsFlatted = txIns.flat();
  for (let currentEpoch = 0; currentEpoch < epochsAmount; currentEpoch++) {
    const txsAmount = txOuts[currentEpoch].length;
    markedTxOutsWithoutTxsIn[currentEpoch] = [];
    for (let currentTx = 0; currentTx < txsAmount; currentTx++) {
      const txOut = txOuts[currentEpoch][currentTx];
      markedTxOutsWithoutTxsIn[currentEpoch].push({
        hasTxIn: txInsFlatted.findIndex(txIn => txIn.tx_out_id === txOut.id) === -1,
        ...txOut
      });
    }
  }
  return markedTxOutsWithoutTxsIn;
};

const setAdaInTxOuts = ({ txOuts, totalAda }) => {
  const epochsAmount = txOuts.length;
  const settedTxOuts = [...txOuts];
  for (let currentEpoch = 0; currentEpoch < epochsAmount; currentEpoch++) {
    let remainingAda = totalAda[currentEpoch];
    const txOutsAmount = settedTxOuts[currentEpoch].length;
    for (let currentTxOut = 0; currentTxOut < txOutsAmount; currentTxOut++) {
      if (txOuts[currentEpoch][currentTxOut].hasTxIn) {
        const adaInTxOut =
          currentTxOut === txOutsAmount - 1 ? remainingAda : randomNumber(0, remainingAda);
        settedTxOuts[currentEpoch][currentTxOut].value = adaInTxOut;
        remainingAda -= adaInTxOut;
      }
      delete settedTxOuts[currentEpoch][currentTxOut].hasTxIn;
    }
  }
  return settedTxOuts;
};

const setAdaInTxOutsWithoutTxIns = ({ txOuts, txIns, totalAda }) => {
  const markedTxOuts = markTxOutsWithoutTxIns({ txOuts, txIns });
  return setAdaInTxOuts({ txOuts: markedTxOuts, totalAda });
};

exports.generateTx = (blockId, fee, outSum) => txGen.generate(blockId, { fee, outSum });

exports.generateTxInsOuts = ({ txs, txOuts, utxoCount, totalAda }) => {
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
  const txOutsWithSettedAdaValue = setAdaInTxOutsWithoutTxIns({ txOuts, txIns, totalAda });

  return { txIns: txIns.flat(), txOuts: txOutsWithSettedAdaValue.flat() };
};

exports.generateTxOut = txid => txOutGen.generate(txid);
