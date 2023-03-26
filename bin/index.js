#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs');
const configPath = '.config.json';
const { fillOrder, getOrders } = require('./utils');

// Load config or create an empty object if not set
let config;
try {
  config = JSON.parse(fs.readFileSync(configPath));
} catch (error) {
  config = {};
}

const argv = yargs
  .command('config', 'Set the filler address', (yargs) => {
    yargs.option('f', {
      alias: 'filler_address',
      type: 'string',
      description: 'The filler address',
      demandOption: true,
    });
  }, (argv) => {
    // Save filler address to config file
    config.filler_address = argv.filler_address;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('Filler address saved:', argv.filler_address);
  })
  .command('fill', 'Fill order with specified amount', (yargs) => {
    yargs.option('o', {
      alias: 'order',
      type: 'string',
      description: 'The order id of the order to fill',
      demandOption: true,
    })
    .option('a', {
      alias: 'amount',
      type: 'number',
      description: 'Amount to fill in xDAI',
      demandOption: true,
    })
    .option('f', {
      alias: 'filler_address',
      type: 'string',
      description: 'The filler address (optional)',
    });
  }, (argv) => {
    // Use filler address from config if not provided
    const fillerAddress = argv.filler_address || config.filler_address;
    fillOrder(argv.order, fillerAddress, argv.amount);
  })
  .command('get_orders', 'Get fillable orders', () => {
    }, () => {
    getOrders();

  })
  .help()
  .alias('help', 'h')
  .argv;
