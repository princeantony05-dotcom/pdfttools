# Use the official Node.js image
FROM node:22-bookworm

# Set working directory
WORKDIR /app

# Stage 1: Install System & Python Tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-dev \
    python3-setuptools \
    build-essential \
    && apt-get clean

# Stage 2: Install LibreOffice & Java
RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-impress \
    libreoffice-pdfimport \
    openjdk-17-jre-headless \
    && apt-get clean

# Stage 3: Install Fonts & Utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    fonts-liberation \
    fonts-noto \
    fonts-dejavu \
    fontconfig \
    ghostscript \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Stage 4: Install Python Conversion AI
RUN pip3 install --no-cache-dir pdf2docx --break-system-packages

# Copy package files and install Node dependencies
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
