FROM node:20-alpine
WORKDIR /lab
COPY app/backend/package*.json ./app/backend/
RUN cd app/backend && npm install --omit=dev
COPY app ./app
ENV PORT=3000
EXPOSE 3000
CMD ["node", "app/backend/server.js"]
