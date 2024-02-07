# GIZ Living Wage Costing Tool API

## Environments - API

| Environment | API                      |
| ----------- | ------------------------ |
| Local       | <http://localhost:3000/> |
| Develop     | <>                       |
| Staging     | <>                       |
| Production  | <>                       |

<!-- ## Environments - Docs

| Environment | API Docs                                    |
| ----------- | ------------------------------------------- |
| Local       | <http://localhost:8080/docs>                |
| Develop     | <> |
| Staging     | <> |
| Production  | <> | -->

## Environments - App

| Environment | Frontend / App |
| ----------- | -------------- |
| Local       | <>             |
| Develop     | <>             |
| Staging     | <>             |
| Production  | <>             |

## Getting Started

### Preparation

Make sure you use `node 20`, use something like [nvm](https://github.com/nvm-sh/nvm) to manage your node versions.

```shell
nvm use 20
```

### Installation

Run these commands in the project root folder.

```shell
# install required packages.
npm ci

# Setup env variables.
cp .env.sample .env
```

### Running the app

```bash
# PostgreSQL Database
npm run start:db

# NestJS App
npm run start
```

## CloudBeaver

To gain an insight into the database you can use any database viewer you would like. A CloudBeaver container is setup for you to use if you would like.

```shell
npm run start:beaver
```

This will startup a CloudBeaver container thar you can access on `localhost:3001` which will utilize .env variables.

NOTE: These are only development credentials and wont work on other environments

If you copied .env.sample the details should look something like this:

| CloudBeaver login |         |
| ----------------- | ------- |
| CB_ADMIN_NAME     | usmedia |
| CB_ADMIN_PASSWORD | usmedia |

| DB Connection |                  |                             |
| ------------- | ---------------- | --------------------------- |
| HOST          | postgres         | NOTE: docker container name |
| USER NAME     | giz_costing_tool |                             |
| USER PASSWORD | giz_costing_tool |                             |
| DATABASE      | giz_costing_tool |                             |
| PORT          | 5432             |                             |

## Migrations & Seeding

### Migrations

On intial setup and every clean database you will need to migrate the database to the latest state using:

```shell
npx mikro-orm migration:up
```

### Seeding

To fill the database with test/fake data run the seed command

```shell
npx mikro-orm seeder:run
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
