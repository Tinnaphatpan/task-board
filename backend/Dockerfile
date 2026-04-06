FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN node ace build

FROM node:22-alpine AS runner

WORKDIR /app
COPY --from=builder /app/build ./
COPY package*.json ./
RUN npm ci --omit=dev

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 3333

CMD sh -c "node ace migration:run --force && node bin/server.js"
