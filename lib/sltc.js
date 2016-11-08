'use strict';

const execSync = require('child_process').execSync;
const util = require('util');
const log = require('intel');
const merge = require('lodash.merge');

const defaultConfig = {
  device: 'eth0',
  bandwidth: '5Mbps',
  latency: '28ms',
  pl: '0%',
};

const setupScripts = [
  'sudo tc qdisc add dev %s root netem delay %s loss %s rate %s',
];

const deleteScripts = [
  'sudo tc qdisc del dev %s root',
];

module.exports = {
  sltc: config => {
    const options = merge({}, defaultConfig, config);

    if (options.remove) {
      deleteScripts.forEach((script) => {
        log.info(util.format(script, options.device));
        execSync(util.format(script, options.device));
      });
    } else {
      setupScripts.forEach((script) => {
        log.info(util.format(script, options.device, options.latency,
          options.pl, options.bandwidth));
        execSync(util.format(script, options.device, options.latency,
          options.pl, options.bandwidth));
      });
    }
  },
};
