FROM node:18-alpine
WORKDIR /app

# Copia package.json e package-lock se existir
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm install --production

# Copia o restante do código
COPY . .

ENV PORT=3001
EXPOSE 3001

CMD ["node", "server.js"]
