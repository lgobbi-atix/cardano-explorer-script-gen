const { blockGen } = require('../models');
const {
  helpers: { randomNumber }
} = require('../utils/data-types');
const { generateTx } = require('./tx');

exports.generateBlock = ({
  previous,
  epochNo,
  slotNo,
  transactionCount,
  totalFeesPaid,
  totalOutput
}) => {
  let totalFees = totalFeesPaid;
  let totalOut = totalOutput;

  const txs = [];
  const block = blockGen.generate(previous, epochNo, slotNo, transactionCount);
  for (let i = 0; i < block.tx_count; i++) {
    const isLastTx = i === block.tx_count - 1;
    let feesPaid = 0;
    let output = 0;
    if (totalFeesPaid > 0) {
      feesPaid = isLastTx ? totalFees : randomNumber(0, totalFees);
    }
    if (totalOut > 0) {
      output = isLastTx ? totalOut : randomNumber(0, totalOut);
    }

    txs.push(generateTx(block.id, feesPaid, output));
    totalFees -= feesPaid;
    totalOut -= output;
  }
  return { ...block, txs };
};
