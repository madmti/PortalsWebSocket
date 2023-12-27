FROM oven/bun:alpine

WORKDIR /app

COPY ./ ./

RUN apk update

RUN bun --version

RUN apk add npm

RUN npm --version

RUN npm install

EXPOSE 5000

ENTRYPOINT [ "sh", "entrypoint.sh" ]