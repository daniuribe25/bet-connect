# PlConnect 🔗

## Getting Started
  1. Add the Oban repo hex repo
      ```
        mix hex.repo add oban https://getoban.pro/repo \
          --fetch-public-key $OBAN_KEY_FINGERPRINT \
          --auth-key $OBAN_LICENSE_KEY
      ```
      Speak to other members of the team to get the required credentials

  2. Install the dependencies required to run the application with the following command
      ```
        mix deps.get
      ```

  3. We now need to fire up a local Postgres DB for the service to use.

     ``` 
       docker-compose -f docker-compose.dev.yml up
     ```

  5. We now need to setup your local database. The following command will run all of the database
       migration files. Ash is a thin wrapper around ecto.

        ```
          mix ash_postgres.create
        ``` 

  6. Finally you need to start the phoenix server, the server will run on localhost:4000 with 
     `localhost:4000/gql` as where to make graphql requests and `localhost:4000/playground` to view graphql playground
      ```
        mix phx.server
      ```

## Creating a new migration
To create a new migration script you should use the following command:
```
  mix ash_postgres.generate_migrations
```
After this is done you can edit the generated file to complete the database
actions you want. Once you are ready to run your migration you can do
```
  mix ash_postgres.migrate
```

## Docker for local environment

You need this tools:
* [Docker](https://www.docker.com/) for Windows, Mac or Linux
* Docker Compose
* [Maketool](http://gnuwin32.sourceforge.net/packages/make.htm) (preinstalled on Mac and Linux, you need install on Windows)

### Commands

* `make` for get deps and create docker image
* `make up` for run the elixir project
* `make testing` for run tests
* `make bash` for run a terminal inside the container
* `make iex` for run iex terminal for use all created code

## Learn more

  * Official website: https://www.phoenixframework.org/
  * Guides: https://hexdocs.pm/phoenix/overview.html
  * Docs: https://hexdocs.pm/phoenix
  * Forum: https://elixirforum.com/c/phoenix-forum
  * Source: https://github.com/phoenixframework/phoenix
