#!/bin/bash
set -e

/usr/src/app/bin/sltc.js
wget -T 20 https://www.sitespeed.io/
