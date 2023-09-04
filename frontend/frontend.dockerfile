# Use a Node.js image
FROM node:18-alpine3.17

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy everything to the container
COPY . .

CMD [ "npm", "run", "dev" ]