FROM rabbitmq:management-alpine

ENV RABBITMQ_SERVER_ADDITIONAL_ERL_ARGS='-rabbitmq_management load_definitions "/etc/rabbitmq/definitions.json"'

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY definitions.json /etc/rabbitmq
RUN chown rabbitmq:rabbitmq /etc/rabbitmq/definitions.json
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
