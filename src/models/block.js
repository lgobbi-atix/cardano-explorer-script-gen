const dataTypes = require('../utils/data-types');
const idManager = require('../utils/id-manager');

const slotLeaders = require('../static-data/slot_leader');

const { randomNumber, decodeHash } = dataTypes.helpers;

const SLOT_LEADERS_COUNT = 9;

exports.generate = (previousId, epochNo, slotNo, txCount) => {
  if (!previousId) throw new Error('block needs previousId reference');
  if (!epochNo) throw new Error('block needs epochNo reference');
  if (!slotNo) throw new Error('block needs slotNo reference');
  return {
    id: idManager.getNextBlockId(),
    hash: dataTypes.hash32type(), // UNIQUE
    slot_no: slotNo,
    block_no: dataTypes.uinteger(),
    previous: previousId,
    merkel_root: dataTypes.hash32type(),
    slot_leader: slotLeaders.data[randomNumber(0, SLOT_LEADERS_COUNT - 1)].id,
    epoch_no: epochNo,
    time: new Date(),
    tx_count: txCount || 0
  };
};

exports.buildQuery = block => {
  const {
    id,
    hash,
    slot_no,
    block_no,
    previous,
    merkel_root,
    slot_leader,
    size,
    epoch_no,
    time,
    tx_count
  } = block;
  const query =
    'INSERT INTO public.block ' +
    '(id,hash,slot_no,block_no,previous,merkel_root,' +
    'slot_leader,"size",epoch_no,"time",tx_count) VALUES\n' +
    `($1, ${decodeHash('$2')}, $3, $4, $5, ${decodeHash('$6')}, ` +
    '$7, $8, $9, $10, $11);';

  return {
    query,
    values: [
      id,
      hash,
      slot_no,
      block_no,
      previous,
      merkel_root,
      slot_leader,
      size,
      epoch_no,
      time,
      tx_count
    ]
  };
};
