# Use the official Node.js image (Bookworm is more stable for packages)
FROM node:22-bookworm

# Install LibreOffice and all necessary modules
RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice \
    libreoffice-java-common \
    openjdk-17-jre-headless \
    fonts-liberation \
    fontconfig \
    ghostscript \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the frontend
RUN npm run build

# Expose the port
EXPOSE 3001

# Start the server
CMD ["npm", "start"]
