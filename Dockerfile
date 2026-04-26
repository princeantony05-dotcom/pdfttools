# Use the official Node.js image (Bookworm is more stable for packages)
FROM node:22-bookworm

# Install LibreOffice, Java, Python, and the high-end pdf2docx engine
RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice \
    openjdk-17-jre-headless \
    fonts-liberation \
    fonts-noto \
    fonts-dejavu \
    fontconfig \
    ghostscript \
    python3 \
    python3-pip \
    python3-setuptools \
    python3-dev \
    build-essential \
    && pip3 install --no-cache-dir pdf2docx \
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
