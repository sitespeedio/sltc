const execSync = require('child_process').execSync;
const util = require('util');
const log = require('intel');

const setupScripts = [
  'sudo tc qdisc add dev %s root netem delay %s loss %s rate %s',
];

const deleteScripts = [
  'sudo tc qdisc del dev %s root',
];

module.exports = {
  remove: options => {
    deleteScripts.forEach((script) => {
      log.info(util.format(script, options.device));
      execSync(util.format(script, options.device));
    });
  },
  setup: options => {
    setupScripts.forEach((script) => {
      log.info(util.format(script, options.device, options.latency,
        options.pl, options.bandwidth.upload));
      execSync(util.format(script, options.device, options.latency,
        options.pl, options.bandwidth.upload));
    });
  },
};
