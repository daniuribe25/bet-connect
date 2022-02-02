IMAGE_TAG := pl-connect/api
REVISION=$(shell git rev-parse --short HEAD)
RUN_STANDARD := docker run --rm -v `pwd`:/app -w /app -m 4096m --cpus="4" elixir:1.12.3
# RUN_STANDARD := docker run --rm -v `pwd`:/app -v `pwd`/../../ash_admin:/ash_admin -w /app elixir:1.12.3

include .env

all: build image

up:
	docker-compose up

build:
	$(RUN_STANDARD) mix do local.rebar --force, local.hex --force, \
 		hex.repo add oban https://getoban.pro/repo --fetch-public-key $(OBAN_KEY_FINGERPRINT) --auth-key $(OBAN_LICENSE_KEY), \
		deps.get, \
		deps.compile --force, \
		compile --plt

image:
	docker build -t ${IMAGE_TAG}:${REVISION} --build-arg OBAN_KEY_FINGERPRINT=$(OBAN_KEY_FINGERPRINT) --build-arg OBAN_LICENSE_KEY=$(OBAN_LICENSE_KEY) .
	docker tag ${IMAGE_TAG}:${REVISION} ${IMAGE_TAG}:latest

testing:
	docker-compose run --rm -e "MIX_ENV=test" app mix test

credo:
	docker-compose run --rm -e "MIX_ENV=test" app mix credo

iex:
	docker-compose exec app iex -S mix

bash:
	docker-compose exec app bash

rollback:
	docker-compose exec app mix ecto.rollback

migrate:
	docker-compose exec app mix ecto.migrate

ash_migrations:
	docker-compose run --rm app mix ash_postgres.generate_migrations

format:
	docker-compose exec app mix format
