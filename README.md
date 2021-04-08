<h1 align="center">HR Solution</h1>

## ❯ This project forked from [w3tecch/express-typescript-boilerplate](https://github.com/w3tecch/express-typescript-boilerplate)

## ❯ Getting Started

### Step 1: Set up the Development Environment

Then copy the `.env.example` file and rename it to `.env`. In this file you have to add your database connection information.

Create a new database with the name you have in your `.env`-file.

Then setup your application environment.
### Step 3: Init Database

Go to the project dir and execute.
```bash
npm run typeorm migration:run
```

> This command will migration the database

## ❯ Create default data

Go to the project dir and execute.
```bash
npm run seed seed
```
> This command create role [admin, manager, user] and user admin in database
## serve

Go to the project dir and execute.
```bash
npm start serve
```

Thanks www.openode.io for hosting
