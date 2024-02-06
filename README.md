GIZ Living Wage Costing Tool API
====================

## Environments - API

| Environment | API                                     |
| ----------- | --------------------------------------- |
| Local       | <http://localhost:3000/>                |
| Develop     | <> |
| Staging     | <> |
| Production  | <> |

<!-- ## Environments - Docs

| Environment | API Docs                                    |
| ----------- | ------------------------------------------- |
| Local       | <http://localhost:8080/docs>                |
| Develop     | <> |
| Staging     | <> |
| Production  | <> | -->

## Environments - App

| Environment | Frontend / App                                         |
| ----------- | ------------------------------------------------------ |
| Local       | <> |
| Develop     | <> |
| Staging     | <> |
| Production  | <> |


## Getting Started

### Preparation

Make sure you use `node 20`, use something like [nvm](https://github.com/nvm-sh/nvm) to manage your node versions.

```shell
$ nvm use 20
```

### Installation

Run these commands in the project root folder.

```shell
# install required packages.
$ npm ci

# Setup env variables.
$ cp .env.sample .env
```

### Running the app

```bash
# development
$ npm run start

# debug mode
$ npm run start:debug

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
