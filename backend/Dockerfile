# Stage 1: Build (компиляция TypeScript)
FROM node:20-bookworm-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

# Копируем package файлы
COPY backend/package*.json ./

# Устанавливаем все зависимости (включая dev для TypeScript)
RUN npm install

# Копируем исходный код
COPY backend/src ./src
COPY backend/prisma ./prisma
COPY backend/tsconfig.json ./

# Генерируем Prisma client перед сборкой
RUN npx prisma generate

# Компилируем TypeScript в JavaScript
RUN npm run build



# Stage 2: Runtime (только production зависимости)
FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

# Копируем package файлы
COPY backend/package*.json ./

# Устанавливаем только production зависимости
RUN npm install --only=production

# Копируем сгенерированный Prisma client из stage сборки
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Копируем скомпилированный код из Stage 1
COPY --from=builder /app/dist ./dist

EXPOSE 4000

# Запускаем скомпилированный JavaScript
CMD ["npm", "start"]