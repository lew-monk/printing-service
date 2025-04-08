# Use the official Node.js 18 LTS image as the base image
FROM node:alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install project dependencies using pnpm
RUN pnpm install 

# Copy the rest of the project files to the working directory
COPY . .

# Build the TypeScript project

# Expose the port the application runs on
EXPOSE 4000

# Define the command to run the application
CMD ["pnpm", "dev"]
