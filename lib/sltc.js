'use strict';

const merge = require('lodash.merge');
const simple = require('./simple');
const modprobe = require('./modprobe');

const defaultConfig = {
  device: 'eth0',
  bandwidth: {
    download: '5Mbps',
    upload: '1.6Mbps',
  },
  latency: '28ms',
  pl: '0%',
};

module.exports = {
  sltc: config => {
    const options = merge({}, defaultConfig, config);

    if (options.modprobe) {
      if (options.remove) {
        return modprobe.remove(options);
      }
      return modprobe.setup(options);
    } else if (options.remove) {
      return simple.remove(options);
    }
    return simple.setup(options);
  },
};
