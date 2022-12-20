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

### .env
In this file you may configure your MongoDB connection url, app's port and a url to documentation (this will be returned with error responses, see [error section](#error-handling)). Rename the `.env.example` in the root directory to `.env` then just update with your settings.

|key|description|default
|---|---|---
|APP_PORT|Port number where the app will run.|`3333`
|MONGO_HOST|MongoDB's host.|`mongodb`
|MONGO_PORT|MongoDB's port.|`27017`
|MONGO_DB|Database name.|`cargo-terminal`
|DOCS_URL|An url to docs where users can find more information about the app's internal code errors.|`https://github.com/DiegoVictor/cargo-terminal-api#errors-reference`

# Usage
To start up the app run:
```
$ yarn dev:server
```
Or:
```
npm run dev:server
```

## Error Handling
Instead of only throw a simple message and HTTP Status Code this API return friendly errors:
```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Arrival not found",
  "code": 146,
  "docs": "https://github.com/DiegoVictor/devradar-api#errors-reference"
}
```
> Errors are implemented with [@hapi/boom](https://github.com/hapijs/boom).
> As you can see a url to error docs are returned too. To configure this url update the `DOCS_URL` key from `.env` file.
> In the next sub section ([Errors Reference](#errors-reference)) you can see the errors `code` description.

### Errors Reference
|code|message|description
|---|---|---
|144|Vehicle not found|The `id` sent not references an existing vehicle in the database while creating an arrival.
|145|Driver not found|The `id` sent not references an existing driver in the database while creating an arrival.
|146|Arrival not found|The `id` sent not references an existing arrival in the database while trying to update an arrival.
|147|Vehicle not found|The `id` sent not references an existing vehicle in the database while  trying to update an arrival.
|148|Driver not found|The `id` sent not references an existing driver in the database while trying to update an arrival.
|244|Vehicle not found|The `id` sent not references an existing vehicle in the database while creating a driver.
|245|Driver not found|The `id` sent not references an existing driver in the database while trying to update a driver.
|246|Vehicle not found|The `id` sent not references an existing vehicle in the database while trying to update a driver.
|344|Vehicle not found|The `id` sent not references an existing vehicle in the database while trying to update a vehicle.

## Pagination
All the routes with pagination returns 5 records per page, to navigate to other pages just send the `page` query parameter with the number of the page.

* To get the third page of incidents:
```
GET http://localhost:3333/v1/arrivals?page=3
```

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
