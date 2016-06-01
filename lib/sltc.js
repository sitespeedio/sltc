'use strict';

var execSync = require('child_process').execSync,
    util = require('util'),
    merge = require('lodash.merge');

const defaultConfig = {
    device: 'eth0',
    bandwidth: '5Mbps',
    latency: '28ms',
    pl: '0%'
};

const setupScripts = [
  'sudo tc qdisc add dev %s handle 1: root htb default 11'
];

const rateScripts = [
    'sudo tc class add dev %s parent 1: classid 1:1 htb rate %s',
    'sudo tc class add dev %s parent 1:1 classid 1:11 htb rate %s'
];

const delayScripts = [
    'sudo tc qdisc add dev %s parent 1:11 handle 10: netem delay %s'
];

const packageLossScripts = [
  'sudo tc qdisc change dev %s parent 1:11 handle 10: netem loss %s'
];


let deleteScripts = [
  'sudo tc qdisc del dev %s root'
];

module.exports = {
    sltc: function(config) {
        const options = merge({}, defaultConfig, config);

        if (options.remove) {
            deleteScripts.forEach((script) => {
                execSync(util.format(script, options.device));
            })
        } else {
            setupScripts.forEach((script) => {
                execSync(util.format(script, options.device));
            })
            rateScripts.forEach((script) => {
                execSync(util.format(script, options.device, options.bandwidth));
            })
            delayScripts.forEach((script) => {
                execSync(util.format(script, options.device, options.latency));
            })
            packageLossScripts.forEach((script) => {
                execSync(util.format(script, options.device, options.pl));
            })
        }
    }
};
