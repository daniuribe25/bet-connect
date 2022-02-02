# PL Connect [![codecov](https://codecov.io/gh/players-lounge/pl-connect/branch/staging/graph/badge.svg?token=U4AjeBgSJW)](https://codecov.io/gh/players-lounge/pl-connect)

## What is PL Connect?
PL Connect is a new product by Players' Lounge that allows 
users to play by themselves or form teams with friends and
place wagers against how well they will perform in public 
games.

## What games are supported by PL Connect?
Currently we only support
 - Call of Duty Warzone
   -  Verdansk
   -  Rebirth Island

# Technologies
In this repository you will find two main folder `api` and `client`
both of these folders will contain their own readme with how to get started

## API
The API is built in Elixir using the Phoenix framework. It is fronted by 
Absinthe, a graphql client for Elixir and ash_graphql for generating the
graphql queries and mutations. 

The data for this application is stored within a postgres database and
this is interacted with via ecto


### Starting backend
Edit `.env.sample` with credentials and copy to `.env`
Run `docker-compose.up`
