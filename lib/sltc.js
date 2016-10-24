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


module.exports = {
  sltc: config => {
    const options = merge({}, defaultConfig, config);
    const sudo = options.sudo ? 'sudo ' : '';
    const setupScripts = [
      sudo + 'tc qdisc add dev %s handle 1: root htb',
      sudo + 'tc filter add dev %s protocol ip prio 1 u32 match ip dport 80 0xffff flowid 1:11',
    ];

    const rateScripts = [
      sudo + 'tc class add dev %s parent 1: classid 1:11 htb rate %s',
    ];

    const delayLossScripts = [
      sudo + 'tc qdisc add dev %s parent 1:11 handle 10: netem delay %s loss %s',
    ];

    const deleteScripts = [
      sudo + 'tc qdisc del dev %s root',
    ];

    if (options.remove) {
      deleteScripts.forEach((script) => {
        log.info(util.format(script, options.device));
        execSync(util.format(script, options.device));
      });
    } else {
      setupScripts.forEach((script) => {
        log.info(util.format(script, options.device));
        execSync(util.format(script, options.device));
      });
      rateScripts.forEach((script) => {
        log.info(util.format(script, options.device, options.bandwidth));
        execSync(util.format(script, options.device, options.bandwidth));
      });

      delayLossScripts.forEach((script) => {
        log.info(util.format(script, options.device, options.latency, options.pl));
        execSync(util.format(script, options.device, options.latency, options.pl));
      });
    }
  },
};
