# Event Calendar App


## Getting Started


### Prerequisites

#### Using NPM
- [NodeJS](https://nodejs.org/en/download/)
- [NPM](https://www.npmjs.com/get-npm)

#### Using docker
- [Docker](https://docs.docker.com/install/)
- [Mkcert](https://github.com/FiloSottile/mkcert) (Optional; for generating development certificates)

### Clone the repository

```bash
$ git clone git@github.com:lucasjellema/vue-event-agenda-prototype.git
```

### Starting with NPM
To start the application with NPM you need to 
navigate to the `services/frontend` folder and run the following commands:

```bash
$ npm install
$ npm run dev
```


### Starting with Docker Compose (Ubuntu)

#### Generate development certificates
Generate a certificate for `*.vue-event-calendar.localhost` using mkcert and
place the certificate and key in the `docker/traefik/rootFS/certificates` folder.

```bash
$ mkcert "*.vue-event-calendar.localhost"
```

**Important:** Make sure to install the mkcert root certificate on your system.


#### Starting the application

```bash
$ docker compose up -d
```

#### Stopping the application

```bash
$ docker compose down
```


## About the repository

### Directory Structure

| Directory  | Description                                                                             |
|------------|-----------------------------------------------------------------------------------------|
| `docker`   | The docker folder contains files relating to docker services.                           |
| `services` | The services folder contains folders representing a certain service of the application. |
| `shared`   | The shared folder contains files that is shared across multiple services.               |


