FROM node:18.16.0 as build

WORKDIR /app

COPY ./services/frontend/package.json ./services/frontend/package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18.16.0-alpine as dev-stage

WORKDIR /app

COPY ./services/frontend/package.json ./services/frontend/package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5173

# npm run dev -- --host
CMD ["npm", "run", "dev", "--", "--host"]


FROM nginx:1.21.1-alpine as prod-stage

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
