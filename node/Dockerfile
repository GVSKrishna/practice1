FROM node:latest

RUN yarn global add nodemon

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
COPY package.json package.json
COPY yarn.lock yarn.lock


RUN yarn install
ADD . /usr/src/app/
EXPOSE 3000

CMD ["nodemon", "bin/www"]
