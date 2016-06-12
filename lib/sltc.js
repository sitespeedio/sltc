'use strict';

var execSync = require('child_process').execSync,
    util = require('util'),
    log = require('intel'),
    merge = require('lodash.merge');

const defaultConfig = {
    device: 'eth0',
    bandwidth: '5Mbps',
    latency: '28ms',
    pl: '0%'
};

const setupScripts = [
  'sudo tc qdisc add dev %s handle 1: root htb',
  'sudo tc filter add dev %s protocol ip prio 1 u32 match ip dport 80 0xffff flowid 1:11'
];

const rateScripts = [
    'sudo tc class add dev %s parent 1: classid 1:11 htb rate %s'
];

const delayLossScripts = [
    'sudo tc qdisc add dev %s parent 1:11 handle 10: netem delay %s loss %s'
];

let deleteScripts = [
  'sudo tc qdisc del dev %s root'
];

module.exports = {
    sltc: function(config) {
        const options = merge({}, defaultConfig, config);

        if (options.remove) {
            deleteScripts.forEach((script) => {
                log.info(util.format(script, options.device));
                try {
                  execSync(util.format(script, options.device));
                } catch (e) {}
            })
        } else {
            setupScripts.forEach((script) => {
                log.info(util.format(script, options.device));
                try {
                  execSync(util.format(script, options.device));
                } catch (e) {}
            })
            rateScripts.forEach((script) => {
                log.info(util.format(script, options.device, options.bandwidth));
                try {
                  execSync(util.format(script, options.device, options.bandwidth));
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
