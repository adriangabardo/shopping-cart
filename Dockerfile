# Base image
FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . .

RUN yarn
RUN npm install -g typescript
RUN tsc

EXPOSE 8080

CMD [ "node", "./dist/index.js" ]

