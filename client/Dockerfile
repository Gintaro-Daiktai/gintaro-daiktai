FROM node:lts-alpine

WORKDIR /frontend

COPY package.json ./

RUN npm install

COPY * .
RUN npm run build

EXPOSE 5173
 
CMD ["node", "dist/main"]
