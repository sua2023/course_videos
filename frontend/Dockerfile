# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /src

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire React app to the container
COPY . /src/

# Build the React app for production
RUN npm run build

# Expose a port (optional, if you need to access the app via a specific port)
EXPOSE 8080

# Define the command to start the application
CMD ["npm", "start"]
