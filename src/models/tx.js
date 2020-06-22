const dataTypes = require('../utils/data-types');
const idManager = require('../utils/id-manager');

const { decodeHash } = dataTypes.helpers;

exports.generate = (blockid, { fee, outSum } = {}) => {
  if (!blockid) throw new Error('tx needs block.id reference');
  return {
    id: idManager.getNextTxId(),
    hash: dataTypes.hash32type(), // UNIQUE
    block: blockid,
    fee: fee !== undefined ? fee : dataTypes.lovelace(),
    out_sum: outSum !== undefined ? outSum : dataTypes.lovelace(),
    size: dataTypes.uinteger()
  };
};

exports.buildQuery = tx => {
  const { id, hash, block, fee, out_sum, size } = tx;
  const query =
    'INSERT INTO public.tx (id, hash, block, fee, ' +
    'out_sum, size) VALUES\n' +
    `($1, ${decodeHash('$2')}, $3, $4, $5, $6);`;

  return {
    query,
    values: [id, hash, block, fee, out_sum, size]
  };
};
