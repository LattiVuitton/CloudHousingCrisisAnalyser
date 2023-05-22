FROM node:latest

RUN mkdir -p /home/frontend-app

COPY ./build /home/frontend-app/build
COPY ./public /home/frontend-app/public
COPY ./src /home/frontend-app/src
COPY package-lock.json /home/frontend-app/
COPY package.json /home/frontend-app/
COPY temp.html /home/frontend-app/

WORKDIR /home/frontend-app

RUN npm install --force

CMD ["npm","run", "start"]