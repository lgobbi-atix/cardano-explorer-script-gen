const data = {
  id: 1,
  stage_one: 2,
  stage_two: 12,
  stage_three: 0
};

module.exports = {
  data,
  buildQuery: () => {
    const query =
      'INSERT INTO public.schema_version' +
      '(id, stage_one, stage_two, stage_three) VALUES\n' +
      '($1, $2, $3, $4);';

    return {
      query,
      values: Object.values(data)
    };
  }
};
