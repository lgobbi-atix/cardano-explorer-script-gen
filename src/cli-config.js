const yargs = require('yargs');

exports.argv = yargs
  .command('generate', 'Generates SQL files with the data from an input file', {
    in: {
      alias: 'i',
      description: 'Relative path to the input file',
      type: 'string',
      required: true
    },
    out: {
      alias: 'o',
      description: 'Relative path to the output folder',
      type: 'string',
      required: true
    }
  })
  .command('reset-ids', 'Resets IDs to default')
  .command('overwrite-ids', 'Overwrite IDs', {
    in: {
      alias: 'i',
      description: 'Relative path to the overwrite file',
      type: 'string',
      required: true
    }
  })
  .command('show-ids', 'Shows IDs')
  .help()
  .alias('help', 'h').argv;
