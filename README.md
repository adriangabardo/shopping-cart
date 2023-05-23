# Shopping Cart

## Requirements

- Docker (tested with 4.16.2 (95914))
- Docker compose (tested with Compose: v2.15.1)

### Testing requirements

- Node (tested with v16.19.1)
- Yarn (tested with v1.22.19)

## Getting Started

### Docker Compose

To run the application, please use Docker compose to do so.

```bash
docker compose up
```

The included `compose.yaml` script will then:

- Bootup a service for PostgreSQL, it will create a git ignored /data folder for persistence
- Bootup a pgAdmin service that can be accessed from localhost:16543, email and password are in compose file as PGADMIN_DEFAULT_EMAIL and PGADMIN_DEFAULT_PASSWORD
- Bootup a Node server that can be accessed from localhost:8080

The PostgreSQL service includes a DB seeding script that runs the script in `/bin/database-seed.sql`. To better understand the database records that you encounter on first boot, please refer to that file.

Although a huge **NO** under normal circumstances, I have included the `.env` with all required values for the backend to run for everyone's convenience.

### Testing

To run the unit tests, the following command can be used:

```bash
yarn
yarn test
# OR
npm run test
```

### API Documentation

Please find a Postman Collection export under `/docs/api`. This file can be imported into Postman, so that you can interact with the endpoints that have been made available.

An OpenAPI specification has also been included in the same folder.

### More in-depth documentation

Please find more documentation, including my own comments on the state of this project under the `/docs` folder. Personal comments can be found within files called `CONSIDERATIONS.md`.

## Resources

### Dockerfile

- [My own](https://github.com/adriangabardo/casino-royale/blob/main/Dockerfile)
- Friends MongoDB + RabbitMQ example
- [This example](https://github.com/alexeagleson/docker-node-postgres-template/blob/master/docker-compose.yml)
