# Use official Node.js LTS image
FROM node:23-alpine3.20

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema if present (avoid build failures)
COPY prisma ./prisma

# Generate Prisma client only if schema exists
RUN if [ -f prisma/schema.prisma ]; then npx prisma generate; fi

# Copy application source
COPY . .

# (Optional) Expose a port if your bot uses a web server
# EXPOSE 3000

# Start the bot
CMD ["node", "index.js"]