# [API] Cargo Terminal
[![Travis (.com)](https://img.shields.io/travis/com/diegovictor/cargo-terminal-api?logo=travis&style=flat-square)](https://app.travis-ci.com/github/DiegoVictor/cargo-terminal-api)
[![mongo](https://img.shields.io/badge/mongodb-5.13.3-13aa52?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![nodemon](https://img.shields.io/badge/nodemon-2.0.12-76d04b?style=flat-square&logo=nodemon)](https://nodemon.io/)
[![eslint](https://img.shields.io/badge/eslint-7.31.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-26.6.3-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/cargo-terminal-api?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/cargo-terminal-api)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/DiegoVictor/cargo-terminal-api/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Cargo%20Terminal&uri=https%3A%2F%2Fraw.githubusercontent.com%2FDiegoVictor%2Fcargo-terminal-api%2Fmaster%2FInsomnia_2021-06-05.json)


Responsible for provide data to the [`web`](https://github.com/DiegoVictor/cargo-terminal-web) version. Permit to register vehicles, drivers, arrivals and allows to retrieve an aggregation of travels. The app has pagination, pagination's link header (to previous, next, first and last page), friendly errors, validation, also a simple versioning was made.

## Table of Contents
* [Installing](#installing)
  * [Configuring](#configuring)
    * [MongoDB](#mongodb)
    * [.env](#env)
* [Usage](#usage)
  * [Error Handling](#error-handling)
    * [Errors Reference](#errors-reference)
  * [Pagination](#pagination)
    * [Link Header](#link-header)
    * [X-Total-Count](#x-total-count)
  * [Versioning](#versioning)
  * [Routes](#routes)
    * [Requests](#requests)
* [Running the tests](#running-the-tests)
  * [Coverage report](#coverage-report)

# Installing
Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

## Configuring
The application use just one database: [MongoDB](https://www.mongodb.com). For the fastest setup is recommended to use [docker-compose](https://docs.docker.com/compose/), you just need to up all services:
```
$ docker-compose up -d
```

### MongoDB
Store all application data. If for any reason you would like to create a MongoDB container instead of use `docker-compose`, you can do it by running the following command:
```
$ docker run --name cargo-terminal-mongo -d -p 27017:27017 mongo
```


# Dependencies
Was installed and configured the `eslint` and `prettier` to keep the code clean and patterned.

# Databases
The application use one database: MongoDB. For the fastest setup is recommended to use docker, see how to do it below.
> Windows users using Docker Toolbox, maybe be necessary in your `env` file set the MongoDB' host to `192.168.99.100` (docker machine IP) instead of `localhost` or `127.0.0.1`

## MongoDB
```
$ docker run --name truck-system-mongo -d -p 27017:27017 mongo
$ docker start truck-system-mongo
```

# .env
Rename the `.env.example` to `.env` then just update with yours settings.

# Start Up
```
$ yarn dev
```


# Running the tests
[Jest](https://jestjs.io/) was the choice to test the app, to run:
```
$ yarn test
```
Or:
```
$ npm run test
```

## Coverage report
You can see the coverage report inside `tests/coverage`. They are automatically created after the tests run.
