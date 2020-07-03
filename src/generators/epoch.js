const settings = require('../../settings.json');
const { epochGen } = require('../models');
const {
  helpers: { randomNumber }
} = require('../utils/data-types');
const { generateBlock } = require('./block');

exports.generateEpoch = ({
  transactionCount,
  blockCount,
  totalFeesPaid,
  totalOutput,
  utxoStateAmount
}) => {
  let totalTxs = transactionCount;
  let totalFees = totalFeesPaid;
  let totalOut = totalOutput;
  let totalUtxos = utxoStateAmount;

  let lastBlockId = settings.nextBlockId;
  const blocks = [];
  const epoch = epochGen.generate(transactionCount, blockCount);

  for (let i = 0; i < epoch.blk_count; i++) {
    const isLastBlock = i === epoch.blk_count - 1;
    let feesPaid = 0;
    let output = 0;
    const txsInBlock = isLastBlock ? totalTxs : randomNumber(0, totalTxs);
    const utxosInBlock = isLastBlock ? totalUtxos : randomNumber(0, totalUtxos);
    const hasLastTx = txsInBlock === totalTxs;
    if (txsInBlock > 0) {
      feesPaid = isLastBlock || hasLastTx ? totalFees : randomNumber(0, totalFees);
      output = isLastBlock || hasLastTx ? totalOutput : randomNumber(0, totalOut);
    }

    const block = generateBlock({
      previous: lastBlockId,
      epochNo: epoch.no,
      slotNo: i + 1,
      transactionCount: txsInBlock,
      totalFeesPaid: feesPaid,
      totalOutput: output
    });

    blocks.push(block);

    totalTxs -= txsInBlock;
    totalUtxos -= utxosInBlock;
    totalFees -= feesPaid;
    totalOut -= output;
    lastBlockId = block.id;
  }

  return { ...epoch, blocks };
};
