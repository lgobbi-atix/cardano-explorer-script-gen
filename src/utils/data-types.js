const faker = require('faker');

const HASH28_LENGTH = 56;
const HASH32_LENGTH = 64;

const BIGINT_MAX = 9223372036854775807;
const INTEGER_MAX = 2147483647;
const SMALLINT_MAX = 1023;
const LOVELACTE_MAX = 45000000000000000;

const arrayOf = (dataType, min = 1, max) => {
  max = max || min;
  return Array.from({ length: faker.random.number({ min, max }) }).map(() => dataType(), {});
};
const nullable = dataType => faker.helpers.randomize([dataType, null]);
const decodeHash = hash => `decode(${hash},'hex')`;
const randomNumber = (min = 0, max = INTEGER_MAX) => faker.random.number({ min, max });
const randomHash = length => faker.random.hexaDecimal(length);

const hash28type = () =>
  randomHash(HASH28_LENGTH)
    .toUpperCase()
    .replace('0X', '');
const hash32type = () =>
  randomHash(HASH32_LENGTH)
    .toUpperCase()
    .replace('0X', '');

const lovelace = () => randomNumber(0, LOVELACTE_MAX);
const outsum = () => randomNumber(0, BIGINT_MAX);
const txindex = () => randomNumber(0, SMALLINT_MAX);
const uinteger = () => randomNumber();

module.exports = {
  helpers: {
    arrayOf,
    nullable,
    decodeHash,
    randomNumber,
    randomHash
  },
  hash28type,
  hash32type,
  lovelace,
  outsum,
  txindex,
  uinteger
};
