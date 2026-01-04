FROM node:20-alpine

WORKDIR /home/app

COPY . .

RUN npm install -g pnpm@latest
RUN pnpm install

RUN pnpm prisma generate
RUN pnpm run build

EXPOSE 3000

CMD ["npm","start"]

