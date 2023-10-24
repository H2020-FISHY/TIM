FROM alpine:3.10 as builder

RUN  apk add --no-cache nodejs nodejs-npm build-base python curl git

ARG NPMRC_CONTENT
RUN touch "$HOME/.npmrc"
RUN echo "${NPMRC_CONTENT}" > "$HOME/.npmrc"
RUN mkdir /service


COPY package.json /service
WORKDIR /service
RUN npm i --only=production


FROM alpine:3.10
#RUN apk add --no-cache nodejs nodejs-npm python build-base curl
RUN apk add --no-cache nodejs nodejs-npm ansible make openssh openjdk11 unzip bash && \
    rm -rf /var/cache/apk/*

COPY . /service
RUN chmod 0700 /service/id_rsa
COPY --from=builder /service/node_modules /service/node_modules
WORKDIR /service

ENTRYPOINT ["node", "app.js"]
