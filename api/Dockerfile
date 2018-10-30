FROM node

COPY . /api
WORKDIR /api

RUN npm install
CMD while !</dev/tcp/db/5432; do sleep 1; done;
CMD npm start

EXPOSE 5000
