# Love Me Tender - Tender Management System

## Prerequisites

Ensure the following are installed on your system before proceeding:

- Docker Engine
- Docker Compose
- Node.js and npm (Node Package Manager)

## Deployed Website on render

This is our deployed website link https://love-me-tender-51qa.onrender.com

To deploy the project's latest version follow the steps below;

1. Go to render dashboard
2. Click on Manual Deploy button
3. Select deploy latest commit

## ⏬ Installation and setup

To run this website locally, follow the following instructions:

1. Clone the repo

```sh
git clone https://github.com/LauraSantiag0/Love-Me-Tender
```

2. Run this command to start the database

```sh
docker compose up -d
```

3. Install NPM packages

```sh
npm install
```

4. Run the build command

```sh
npm run build
```

5. Run the code

```sh
npm start
```

## Database Migrations

To modify the database, run the command below from the database folder, and add DB modifications in the generated ...-up.sql file

Then run above command again.

```sh
node ../node_modules/db-migrate/bin/db-migrate create name-for-the-migration --sql-file
```

## Data base credentials

To run the database locally, add the following variables to your .env file:
DB_PASSWORD=opensesame
DB_USERNAME=postgres

## SMTP configuration

To configure the SMTP server, add the following variables to your .env file and set their values based on your provider:

MAIL_HOST=<your_smtp_host>
MAIL_PORT=<your_smtp_port>
MAIL_USER=<your_smtp_user>
MAIL_PASSWORD=<your_smtp_password>

Replace <your_smtp_host>, <your_smtp_port>, <your_smtp_user>, and <your_smtp_password> with the appropriate values provided by your SMTP service.
