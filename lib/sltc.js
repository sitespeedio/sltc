'use strict';

const execSync = require('child_process').execSync;
const util = require('util');
const log = require('intel');
const merge = require('lodash.merge');

const defaultConfig = {
  device: 'eth0',
  ifb: 'ifb0',
  bandwidth: '1Mbps',
  latency: '28ms',
  pl: '0%',
};

const setupIfbScripts = [
  'sudo ip link add %s type ifb',
  'sudo tc qdisc add dev %s handle 1: root htb',
  'sudo tc filter add dev %s protocol ip prio 1 u32 match ip sport 80 0xffff flowid 1:11'
];

const setupInterfaceScripts = [
  'sudo tc qdisc add dev %s handle 1: root htb',
  'sudo tc filter add dev %s protocol ip prio 1 u32 match ip dport 80 0xffff flowid 1:11',
  'sudo tc qdisc add dev %s ingress handle ffff:',
  'sudo tc filter add dev %s parent ffff: protocol ip u32 match u32 0 0 action mirred egress redirect dev ifb0',
]

const rateScripts = [
  'sudo tc class add dev %s parent 1: classid 1:11 htb rate %s'
];

const rateContScripts = [
  'sudo tc class add dev ifb0 parent 1: classid 1:11 htb rate 1Mbps'
]

const delayLossScripts = [
  'sudo tc qdisc add dev %s parent 1:11 handle 10: netem delay %s loss %s',
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
      setupIfbScripts.forEach((script) => {
        log.info(util.format(script, options.ifb));
        execSync(util.format(script, options.ifb));
      });
      setupInterfaceScripts.forEach((script) => {
        log.info(util.format(script, options.device));
        execSync(util.format(script, options.device));
      });
      rateScripts.forEach((script) => {
        log.info(util.format(script, options.device, options.bandwidth));
        execSync(util.format(script, options.device, options.bandwidth));
      });
      rateContScripts.forEach((script) => {
        log.info(util.format(script));
        execSync(util.format(script));
      });

      delayLossScripts.forEach((script) => {
        log.info(util.format(script, options.device, options.latency, options.pl));
        execSync(util.format(script, options.device, options.latency, options.pl));
      });
    }
  },
};
