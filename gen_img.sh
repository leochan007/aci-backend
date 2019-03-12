#!/bin/bash

set -x

source module_def.sh

if [ -n "$1" ]; then
  FLAG=$1
fi

if [ "testnet" != "$FLAG" ]; then
  img_name=$img_name-stg
fi

docker rmi $img_name

docker rmi $PREFIX/$img_name:v1

rm -rf tmp/aci-commons

cp -rf ../aci-commons tmp

docker build --no-cache -t $img_name .

docker tag $img_name:latest $PREFIX/$img_name:v1

#docker push nexus.alphacario.com:8089/aci-backend:v1
#docker push nexus.alphacario.com:8089/aci-backend-stg:v1
