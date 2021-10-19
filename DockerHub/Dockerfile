# syntax=docker/dockerfile:experimental
FROM node:stretch@sha256:a265a30b2dfdcb56ecadc12bc8b7df2c2a90530d88df82152861e0b339ec8e0e

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
