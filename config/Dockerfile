FROM node:20

WORKDIR /usr/src/app

# Copy package.json, package-lock.json and install packages
COPY package*.json ./
RUN npm ci

# Copy source and env file
COPY . .
COPY .env ./

# Build app
RUN npm run build

# Expose port and start the server
EXPOSE 3000
CMD ["npm", "run", "start:prod"]