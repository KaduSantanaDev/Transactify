FROM node:22

WORKDIR /app

COPY ../../package.json ../../package-lock.json ./

COPY . .

EXPOSE 3000

RUN npm install
CMD ["npm", "run", "start", "producer-api"]