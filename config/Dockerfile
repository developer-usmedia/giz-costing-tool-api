###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM --platform=linux/amd64 node:20-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM --platform=linux/amd64 node:20-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV ENV production

RUN npm ci --omit=dev && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM --platform=linux/amd64 node:20-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]