FROM sitespeedio/webbrowsers

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install --production
COPY . /usr/src/app

WORKDIR /

COPY docker/start.sh /start.sh

ENTRYPOINT ["/start.sh"]
