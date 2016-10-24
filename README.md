# Simple Linux Traffic Control
[![Build status][travis-image]][travis-url]

The main goal with this program is to have simple working traffic shaping script working inside of Docker with an Ubuntu base image.

With the current version you can only have the same up and download speed and we are very open for PR to fix that :)

<pre>
bin/sltc.js --help
   Run Simple Linux Traffic Control
   Usage: sltc [options]

   Options:
   --device                  The device to use [eth0]
   --bandwidth               Bandwidth [5Mbps]
   --latency                 Latency [28ms]
   --pl                      Packet loss in percent [0%]
   --remove                  Remove tc current rules
</pre>


[travis-image]: https://img.shields.io/travis/sitespeedio/sltc.svg?style=flat-square
[travis-url]: https://travis-ci.org/sitespeedio/sltc
