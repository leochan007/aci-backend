FROM leochan007/nodejs_base

LABEL MAINTAINER leo chan <leochan007@163.com>

ENV DEBIAN_FRONTEND noninteractive

COPY tmp/aci-commons /root/aci-commons

COPY bin /root/backend/bin

COPY routes /root/backend/routes

COPY swagger /root/backend/swagger

COPY utils /root/backend/utils

COPY app.js /root/backend/

COPY package.json /root/backend/

COPY yarn.lock /root/backend/

WORKDIR /root/backend/

RUN yarn

CMD yarn run prd; tail -f /dev/null
