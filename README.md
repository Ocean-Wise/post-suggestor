Aquablog Post Suggestion Site (Uses NodeJS, Docker, React, and Postgres).

## Getting started:
* Install [Docker-CE](https://docs.docker.com/engine/installation)
* Install [docker-compose](https://docs.docker.com/compose/install/)
Then run the following commands:

```bash
$ mkdir myApp
$ cd myApp
$ git clone https://github.com/edinnen/aquablogPosts.git .
$ docker-compose up
```
Then you can open the React frontend at localhost:3000 and the RESTful NodeJS API at localhost:5000

Changing any frontend (React) code locally will cause a hot-reload in the browser with updates and changing any backend (NodeJS) code locally will also automatically update any changes.

## Production

Remember to set the production URL or IP in the frontend/util/Urls.js file. You may also need to change the ports in Urls.js, docker-compose.yml, and the Dockerfiles in frontend/ and api/ as follows:
* Frontend => :80
* API => :443

Then to build production images run:
```bash
$ docker build ./api --build-arg app_env=production
$ docker build ./frontend --build-arg app_env=production
$ docker build ./db
```
