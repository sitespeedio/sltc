'use strict';

var execSync = require('child_process').execSync,
    util = require('util'),
    log = require('intel'),
    merge = require('lodash.merge');

const defaultConfig = {
    device: 'eth0',
    bandwidth: {
      download: '625kbps',
      upload: '200kbps'
    },
    latency: '28ms',
    pl: '0%'
};

const setupScripts = [
  'sudo tc qdisc add dev %s handle 1: root htb',
  'sudo tc filter add dev %s protocol ip prio 1 u32 match ip dport 80 0xffff flowid 1:11',

  // Re-create the root ingress TBF queuing discipline.
  'sudo tc qdisc add dev %s ingress handle ffff:',

  // Redirect all ingress IP traffic to the IFB.
  'sudo tc filter add dev %s parent ffff: protocol ip u32 match u32 0 0 action mirred egress redirect dev ifb0',

];

const setupScriptsNoParam = [
  // Set up a known Intermediate Functional Block device (IFB) that we'll redirect the device's
  // ingress traffic to.
  'sudo modprobe ifb numifbs=1',
  'sudo ip link set dev ifb0 up',

  // Process all IP traffic on port 80 flowing across the IFB with the 1:11 class.
  'sudo tc qdisc add dev ifb0 handle 1: root htb',
  'sudo tc filter add dev ifb0 protocol ip prio 1 u32 match ip sport 80 0xffff flowid 1:11'
];

const egressRateScripts = [
  'sudo tc class add dev %s parent 1: classid 1:11 htb rate %s'
];

const ingressRateScripts = [
  'sudo tc class add dev ifb0 parent 1: classid 1:11 htb rate %s'
]

const delayLossScripts = [
    'sudo tc qdisc add dev %s parent 1:11 handle 10: netem delay %s loss %s'
];

let deleteScripts = [
  'sudo tc qdisc del dev %s root',
  'sudo tc qdisc del dev %s ingress',
  'sudo tc qdisc del dev ifb0 root'
];

module.exports = {
    sltc: function(config) {
        const options = merge({}, defaultConfig, config);

        if (options.remove) {
            deleteScripts.forEach((script) => {
              if(!(script.includes('%s'))) {
                log.info(script);
                execSync(script);
              } else {
                log.info(util.format(script, options.device));
                try {
                  execSync(util.format(script, options.device));
                } catch (e) {}
              }
            })
        } else {
            setupScriptsNoParam.forEach((script) => {
                log.info(script);
                try {
                  execSync(script);
                } catch (e) {}
            })
            setupScripts.forEach((script) => {
                log.info(util.format(script, options.device));
                try {
                  execSync(util.format(script, options.device));
                } catch (e) {}
            })
            egressRateScripts.forEach((script) => {
                log.info(util.format(script, options.device, options.bandwidth.upload));
                try {
                  execSync(util.format(script, options.device, options.bandwidth.upload));
                } catch (e) {}
            })
            ingressRateScripts.forEach((script) => {
                log.info(util.format(script, options.bandwidth.download));
                try {
                  execSync(util.format(script, options.bandwidth.download));
                } catch (e) {}
            })
            delayLossScripts.forEach((script) => {
                log.info(util.format(script, options.device, options.latency, options.pl));
                try {
                  execSync(util.format(script, options.device, options.latency, options.pl));
                } catch (e) {}
            })
        }
    }
};
