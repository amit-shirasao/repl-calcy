from node

workdir /app

copy . .

CMD ["node", "index.js"]