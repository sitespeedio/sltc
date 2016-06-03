#!/usr/bin/env node

'use strict';

var hasbin = require('hasbin'),
    sltc = require('../lib/sltc').sltc,
    minimist = require('minimist');

var argv = minimist(process.argv.slice(2));

if (argv.help) {
    console.log('   Run Simple Linux Traffic Control');
    console.log('   Usage: sltc [options] \n');
    console.log('   Options:');
    console.log('   --device                  The device to use [eth0]');
    console.log('   --bandwidth.download      Download bandwidth [5Mbps] ');
    console.log('   --bandwidth.upload        Upload bandwidth [1.6Mbps] ');
    console.log('   --latency                 Latency [28ms]');
    console.log('   --pl                      Packet loss in percent [0%] ');
    console.log('   --remove                  Remove tc current rules');
} else {
    if (!hasbin.all.sync(['tc', 'modprobe', 'ip'])) {
        console.error('You need to have tc in your path to do traffic control');
    } else {
        sltc(argv);
    }
}
