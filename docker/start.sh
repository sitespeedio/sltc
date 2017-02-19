#!/bin/bash
set -e

#/usr/src/app/bin/sltc.js
#./shape.sh start
echo 'Run setup'
./setup-tc.sh

echo 'Run speedtest'
speedtest-cli

echo 'Remove rules'
tc qdisc del dev eth0 ingress
tc qdisc del dev eth0 root

echo 'Run speedtest again'
speedtest-cli

#tc qdisc add dev eth0 handle ffff: ingress
#tc filter add dev eth0 parent ffff: protocol ip prio 50 u32 match ip src 0.0.0.0/0 police rate 800kbit burst 10k drop flowid :1

#tc qdisc show dev eth0
