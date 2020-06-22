const data = {
  id: 1,
  protocol_const: 2160,
  slot_duration: 20000,
  start_time: '2017-09-23 21:44:51.000',
  network_name: 'mainnet'
};

module.exports = {
  data,
  buildQuery: () => {
    const query =
      'INSERT INTO public.meta ' +
      '(id, protocol_const, slot_duration, ' +
      'start_time, network_name) VALUES\n' +
      '($1, $2, $3, $4, $5);';

    return {
      query,
      values: Object.values(data)
    };
  }
};
