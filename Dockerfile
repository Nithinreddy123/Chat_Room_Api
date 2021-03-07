FROM node:10-alpine as builder

WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3033
CMD ["node","index.js"]