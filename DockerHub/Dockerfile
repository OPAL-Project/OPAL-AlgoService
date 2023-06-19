# syntax=docker/dockerfile:experimental
FROM node:stretch@sha256:7e6d5d50f05891e89443f463365e4f60093de12fbbb72c85f6a5fd06533b7fc7

# Install all dependencies
RUN apt-get update -q \
    && apt-get upgrade -y --no-install-recommends \
    && apt-get install -y netcat

# Create app directories
RUN mkdir -p /usr/app/config
WORKDIR /root

# We download the OPAL algo service
RUN git clone -b master https://github.com/aoehmichen/OPAL-AlgoService

WORKDIR /root/OPAL-AlgoService

# Bundle app
RUN cp package.json /usr/app/
RUN cp -R src /usr/app/src

WORKDIR /usr/app

# We create the folder for the savePath
RUN mkdir data

# Install opal-algoservice npm dependencies
RUN npm install
RUN cat /root/.npm/_logs/*; exit 0;

# Run compute service
EXPOSE 80
