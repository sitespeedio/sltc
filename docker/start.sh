#!/bin/bash
set -e

/usr/src/app/bin/sltc.js
speedtest-cli

/usr/src/app/bin/sltc.js --modprobe
speedtest-cli