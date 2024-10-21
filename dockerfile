# Etapa 1: Build do projeto Vue.js
FROM node:16-alpine as build-stage

# Define o diretório de trabalho no container
WORKDIR /app

# Copia o package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install --silent

# Copia o restante dos arquivos do projeto
COPY . .

# Executa o build do projeto Vue.js
RUN npm run build

# Etapa 2: Servir o build com Nginx
FROM nginx:alpine as production-stage

# Copia o build gerado para o diretório padrão do Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Exposição da porta 80
EXPOSE 80

# Comando padrão para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
