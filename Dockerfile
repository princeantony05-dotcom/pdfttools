# Use the official Node.js image
FROM node:22-bookworm

# Set working directory
WORKDIR /app

# Stage 1: Install System & Python Tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-dev \
    python3-venv \
    build-essential \
    && apt-get clean

# Stage 2: Install LibreOffice & Essential Fonts (The "All-in-One" stable version)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice \
    openjdk-17-jre-headless \
    fonts-liberation \
    fonts-noto \
    fonts-dejavu \
    fontconfig \
    ghostscript \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Stage 3: Install Python Conversion AI in a Virtual Environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir pdf2docx

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
