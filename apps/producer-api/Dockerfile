FROM node:22

WORKDIR /app

COPY ../../package.json ../../package-lock.json ./

COPY . .

RUN npm install
CMD ["npm", "run", "start", "producer-api"]