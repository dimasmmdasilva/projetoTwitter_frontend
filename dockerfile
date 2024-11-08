FROM node:16-alpine AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install --silent

COPY . .

RUN npm run build

FROM nginx:alpine AS production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
