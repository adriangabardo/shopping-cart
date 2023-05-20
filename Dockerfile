# Base image
FROM node:latest

# Copy the contents of the repo into the /app folder inside the container
COPY . /app

# Set working directory
WORKDIR /app

# Install dependencies
RUN npm install
RUN npm i -g typescript
RUN tsc
RUN npm link .

ENTRYPOINT ["/usr/local/bin/cart"]