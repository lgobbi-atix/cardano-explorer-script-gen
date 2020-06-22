const { txGen } = require('../models');

exports.generateTx = (blockId, fee, outSum) => txGen.generate(blockId, { fee, outSum });
