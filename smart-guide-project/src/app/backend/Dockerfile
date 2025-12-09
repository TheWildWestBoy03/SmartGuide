FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx tsc
RUN npm prune --production
EXPOSE 4100
CMD ["node", "dist/server.js"]