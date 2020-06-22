const dataTypes = require('../utils/data-types');
const idManager = require('../utils/id-manager');

const { randomHash } = dataTypes.helpers;

const ADDRESS_LENGTH = 104;

exports.generate = txid => {
  if (!txid) throw new Error('tx_out needs tx.id reference');
  return {
    id: idManager.getNextTxOutId(),
    tx_id: txid,
    index: dataTypes.txindex(), // UNIQUE (tx_id, index)
    address: randomHash(ADDRESS_LENGTH),
    value: dataTypes.lovelace()
  };
};

exports.buildQuery = tx_out => {
  const { id, tx_id, index, address, value } = tx_out;
  const query =
    'INSERT INTO public.tx_out (id, tx_id, index, ' +
    'address, value) VALUES\n' +
    '($1, $2, $3, $4, $5);';

  return {
    query,
    values: [id, tx_id, index, address, value]
  };
};
