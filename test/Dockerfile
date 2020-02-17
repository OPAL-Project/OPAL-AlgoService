# Select source image
FROM node:stretch

# Install all dependencies
RUN apt-get update -q && apt-get upgrade -y --no-install-recommends

RUN apt-get install -y apt-utils
RUN apt-get install -y netcat

# Create app directories
RUN mkdir -p /usr/app/config
WORKDIR /usr/app

# Bundle app
COPY ./package.json /usr/app/
COPY ./src /usr/app/src
COPY ./.eslintrc /usr/app/.eslintrc
COPY ./test/*.js /usr/app/test/
COPY ./test/algorithms /usr/app/test/algorithms
COPY ./test/privacyalgorithms /usr/app/test/privacyalgorithms
COPY ./config/opal.algoservice.test.config.js /usr/app/config/opal.algoservice.config.js

WORKDIR /usr/app

# We create the folder for the savePath
RUN mkdir data

# Install opal-algoservice npm dependencies
RUN npm install; exit 0;
RUN cat /root/.npm/_logs/*; exit 0;

# Run algo service
EXPOSE 3001

CMD sh -c './src/wait-for.sh mongodb:27017 -- echo "Server started"'
