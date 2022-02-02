FROM elixir:1.12.3

RUN mix local.rebar --force
RUN mix local.hex --force

RUN apt-get update && apt-get install -y inotify-tools make build-essential python3 python3-pip

WORKDIR /app
COPY . .

ARG OBAN_LICENSE_KEY
ARG OBAN_KEY_FINGERPRINT

RUN mix hex.repo add oban https://getoban.pro/repo \
    --fetch-public-key $OBAN_KEY_FINGERPRINT \
    --auth-key $OBAN_LICENSE_KEY

ADD docker-entrypoint.sh .
ENTRYPOINT ["./docker-entrypoint.sh"]

EXPOSE 5000

CMD ["start"]
