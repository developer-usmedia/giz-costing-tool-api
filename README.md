# GIZ Living Wage Costing Tool API

Google Cloud Project: airy-web-417014

## Environments - API

| Environment | API                                                                                                                               |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Local       | <http://localhost:3000/>                                                                                                          |
| Staging     | <https://giz-costingtool-api-staging-iv6aj7vr2q-ey.a.run.app>                                                                     |
| Production  | <https://api.costing-tool.nachhaltige-agrarlieferketten.org/> or <https://giz-costingtool-api-production-iv6aj7vr2q-ey.a.run.app> |

## Environments - Docs

| Environment | API Docs                                                           |
| ----------- | ------------------------------------------------------------------ |
| Local       | <http://localhost:8080/docs>                                       |
| Staging     | <https://giz-costingtool-api-staging-iv6aj7vr2q-ey.a.run.app/docs> |
| Production  | <https://api.costing-tool.nachhaltige-agrarlieferketten.org/docs>  |

## Environments - App

| Environment | Frontend                                                   |
| ----------- | ---------------------------------------------------------- |
| Local       | <http://localhost:4200>                                    |
| Staging     | <https://staging-dot-airy-web-417014.ey.r.appspot.com> |
| Production  | <https://costing-tool.nachhaltige-agrarlieferketten.org/>  |

## Getting Started

### Preparation

Make sure you use `node 22`, use something like [nvm](https://github.com/nvm-sh/nvm) to manage your node versions.

```shell
nvm use 22
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

# Only on very first start (create db schema etc...)
npm run db:fresh

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

# Using HTTP files to execute requests

JWT token is returned from the login request that is found in auth.http. In development the jwt token will be valid for 1d so it can be used in development. Login normally and use that access token for a day. You can change the value in environment.ts of you need to debug login / jwt issues

## Jetbrains PhpStorm / IntelliJ IDEA

-   Install the [HTTP Client plugin](https://www.jetbrains.com/help/phpstorm/http-client-in-product-code-editor.html)
-   Go to http file
-   And [select the correct environment](https://www.jetbrains.com/help/phpstorm/exploring-http-syntax.html#environment-variables)
-   See all environment options: `./config/http-client.env.json`
-   Setup variables by executing `cp ./config/http-client.env.example.json ./config/http-client.env.json` and fill in the values.
-   Then run one or more of the requests.

## VSCode

-   Install REST Client extension
-   `ctrl/cmd shift p` opens settings
-   Copy example json to regular json `cp ./config/settings.vscode.example.json ./.vscode/settings.json`
-   Go to Rest Client: Switch Environment (cmd/ctrl+shift+p)
-   And select correct environment
-   Execute request

[More info about VSCode Rest Client](https://www.trpkovski.com/2023/03/19/setting-up-global-variables-in-the-rest-client-vs-code-extension)

# JWT
