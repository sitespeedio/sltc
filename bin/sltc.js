#!/usr/bin/env node

'use strict';

const hasbin = require('hasbin');
const sltc = require('../lib/sltc').sltc;
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));

if (argv.help) {
  console.log('   Run Simple Linux Traffic Control');
  console.log('   Usage: sltc [options] \n');
  console.log('   Options:');
  console.log('   --device                  The device to use [eth0]');
  console.log('   --bandwidth               Bandwidth [5Mbps] ');
  console.log('   --latency                 Latency [28ms]');
  console.log('   --pl                      Packet loss in percent [0%] ');
  console.log('   --remove                  Remove tc current rules');
} else {
  if (!hasbin.all.sync(['tc'])) {
    console.error('You need to have tc in your path to do traffic control');
  } else {
    sltc(argv);
  }
}
