const dataTypes = require('../utils/data-types');

const { decodeHash } = dataTypes.helpers;

const data = [
  {
    id: 1,
    hash: '5F20DF933584822601F9E3F8C024EB5EB252FE8CEFB24D1317DC3D43',
    description: 'Genesis slot leader'
  },
  {
    id: 2,
    hash: '00000000000000000000000000000000000000000000000000000000',
    description: 'Epoch boundary slot leader'
  },
  {
    id: 3,
    hash: 'AF2800C124E599D6DEC188A75F8BFDE397EBB778163A18240371F2D1',
    description: 'SlotLeader-af2800c124e599d6'
  },
  {
    id: 4,
    hash: '1DEB82908402C7EE3EFEB16F369D97FBA316EE621D09B32B8969E54B',
    description: 'SlotLeader-1deb82908402c7ee'
  },
  {
    id: 5,
    hash: '6C9E14978B9D6629B8703F4F25E9DF6ED4814B930B8403B0D45350EA',
    description: 'SlotLeader-6c9e14978b9d6629'
  },
  {
    id: 6,
    hash: '43011479A595B300E0726910D0B602FFCDD20466A3B8CEEACD3FBC26',
    description: 'SlotLeader-43011479a595b300'
  },
  {
    id: 7,
    hash: '5071D8802DDD05C59F4DB907BD1749E82E6242CAF6512B20A8368FCF',
    description: 'SlotLeader-5071d8802ddd05c5'
  },
  {
    id: 8,
    hash: '5411C7BF87C252609831A337A713E4859668CBA7BBA70A9C3EF7C398',
    description: 'SlotLeader-5411c7bf87c25260'
  },
  {
    id: 9,
    hash: '65904A89E6D0E5F881513D1736945E051B76F095ECA138EE869D543D',
    description: 'SlotLeader-65904a89e6d0e5f8'
  }
];

module.exports = {
  data,
  buildQuery: () =>
    data.map(leader => {
      const query =
        'INSERT INTO public.slot_leader ' +
        '(id, hash, description) VALUES\n' +
        `($1, ${decodeHash('$2')}, $3);`;

      return {
        query,
        values: Object.values(leader)
      };
    })
};
