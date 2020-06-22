const dataTypes = require('../utils/data-types');
const idManager = require('../utils/id-manager');

const EPOCH_DURATION_DATE = 5;

exports.generate = (txCount, blkCount) => {
  const today = new Date();
  const todayPlusFive = new Date(today).setDate(today.getDate() + EPOCH_DURATION_DATE);
  const id = idManager.getNextEpochId();
  return {
    id,
    out_sum: dataTypes.outsum(),
    tx_count: txCount || 0,
    no: id, // UNIQUE
    start_time: today,
    end_time: new Date(todayPlusFive),
    blk_count: blkCount || 0
  };
};

exports.buildQuery = epoch => {
  const { id, out_sum, tx_count, no, start_time, end_time, blk_count } = epoch;
  const query =
    'INSERT INTO public.epoch ' +
    '(id,out_sum,tx_count,no,start_time,end_time,blk_count) VALUES\n' +
    '($1, $2, $3, $4, $5, $6, $7);';

  return {
    query,
    values: [id, out_sum, tx_count, no, start_time, end_time, blk_count]
  };
};
