/**
 * Reduce an array of blocks into an array of passed key from each epoch
 * @param {Array} blocks
 * @param {String} key
 */
const reduceBlocksToKeyPerEpoch = (blocks, key) => {
  const unflattedMap = blocks.reduce((a, c) => {
    if (!a[c.epoch_no]) a[c.epoch_no] = [];
    a[c.epoch_no].push(c[key]);
    return a;
  }, {});
  return Object.values(unflattedMap).reduce((a, c) => {
    a.push(c.flat());
    return a;
  }, []);
};

module.exports = { reduceBlocksToKeyPerEpoch };
