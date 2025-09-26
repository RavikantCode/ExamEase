FROM node:20.17.0-bullseye-slim

WORKDIR /home/app

COPY . .

RUN rm -rf node_modules package-lock.json
RUN npm install
RUN npm install tailwindcss@3.4.0 postcss@8.4.31 autoprefixer@10.4.16 --save

RUN npx prisma generate
RUN npm run build


EXPOSE 3000

CMD ["npm","start"]
