# Use official Node.js image as base
FROM node:18

# Set working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose application port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
