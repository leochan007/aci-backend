#!/bin/bash

VER=`git rev-parse HEAD`
PREFIX=nexus.alphacario.com:8089
img_name=aci-backend
FLAG=testnet_stg

echo 'img_name:'$img_name
