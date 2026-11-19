# Imagem oficial leve do Node.js
FROM node:20-alpine

# Diretório de trabalho no container
WORKDIR /usr/src/app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências de produção
RUN npm ci --only=production

# Copiar código-fonte da aplicação
COPY src/ ./src/

# Expor a porta da API
EXPOSE 3000

# Variável de ambiente
ENV NODE_ENV=production

# Comando para iniciar a API
CMD ["node", "src/app.js"]