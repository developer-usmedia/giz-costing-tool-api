FROM node:20-alpine

WORKDIR /usr/src/app

COPY --chown=node:node dist ./
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev \
    && npm cache clean --force

USER node

CMD [ "node", "/usr/src/app/api.js" ]
