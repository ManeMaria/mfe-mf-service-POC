# build
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# serve
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
# o build sai em /app/dist e é servido sob /app1/
COPY --from=build /app/dist /usr/share/nginx/html/app1
EXPOSE 80
