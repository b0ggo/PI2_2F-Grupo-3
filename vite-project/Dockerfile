FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --silent

COPY . .

EXPOSE 5173

# Start Vite dev server binding to all interfaces so it's reachable outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
