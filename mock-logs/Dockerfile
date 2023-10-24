FROM alpine:3.8 as builder

RUN  apk add --no-cache nodejs nodejs-npm build-base python curl git

ARG NPMRC_CONTENT
RUN touch "$HOME/.npmrc"
RUN echo "${NPMRC_CONTENT}" > "$HOME/.npmrc"
RUN mkdir /service

COPY . /service
WORKDIR /service

RUN npm i


ENTRYPOINT ["node", "index.js"]
