FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY . .
RUN mkdir -p dist

RUN npm run build

CMD ["sh", "-c", "npm test && npm start"]
