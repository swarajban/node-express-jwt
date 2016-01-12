# node-express-jwt
Sample repository for a an Express node server that can generate JWTs

## Installation

To easily install dependencies, run:
```
$ ./buildme.sh
```

Or: run `npm install` in the `authority/` and `consumer/` directories

## Run
To start the authority server, in one shell:
```
$ ./run_authority.sh
```


To start the authority server, in another shell:
```
$ ./run_consumer.sh
```

## Use

1. Visit localhost:3001 to load the Consumer server
1. The Consumer server will detect you are not logged in
1. You will be redirected to the authority server to login (localhost:3000)
1. Log in with the following credentials
	- email: jwt-jedi@gmail.com
	- password: fn2187
1. The authority server will log you in, generate a JWT and redirect you back to Consumer server
1. You will be logged in to Consumer server via the JWT generated from authority
