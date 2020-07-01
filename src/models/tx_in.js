const dataTypes = require('../utils/data-types');
const idManager = require('../utils/id-manager');

exports.generate = (txInId, txOutId, txoutIndex) => {
  if (!txInId) throw new Error('tx_in need txInId reference');
  if (!txOutId) throw new Error('tx_in need txOutId reference');
  if (txoutIndex === null) throw new Error('tx_in need txoutIndex reference');
  return {
    id: idManager.getNextTxInId(),
    tx_in_id: txInId, // from tx.id
    tx_out_id: txOutId, // from tx.id
    tx_out_index: dataTypes.txindex() // UNIQUE (tx_out_id, tx_out_index);
  };
};

exports.buildQuery = tx_in => {
  const { id, tx_in_id, tx_out_id, tx_out_index } = tx_in;
  const query =
    'INSERT INTO public.tx_in (id, tx_in_id, tx_out_id, ' +
    'tx_out_index) VALUES\n' +
    '($1, $2, $3, $4);';

  return {
    query,
    values: [id, tx_in_id, tx_out_id, tx_out_index]
  };
};
