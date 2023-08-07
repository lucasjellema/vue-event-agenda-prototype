# Event Calendar App


## Getting Started


### Prerequisites
- [Docker](https://docs.docker.com/install/)
- [Mkcert](https://github.com/FiloSottile/mkcert)

### Clone the repository

```bash
$ git clone git@github.com:lucasjellema/vue-event-agenda-prototype.git
```

### Generate development certificates
Generate a certificate for `*.vue-event-calendar.localhost` using mkcert and
place the certificate and key in the `docker/traefik/rootFS/certificates` folder.

```bash
$ mkcert "*.vue-event-calendar.localhost"
```

**Important:** Make sure to install the mkcert root certificate on your system. 

### Starting the docker services


#### On Ubuntu

```bash
$ docker compose up -d
```



## About the repository

### Directory Structure

| Directory  | Description                                                                             |
|------------|-----------------------------------------------------------------------------------------|
| `docker`   | The docker folder contains files relating to docker services.                           |
| `services` | The services folder contains folders representing a certain service of the application. |
| `shared`   | The shared folder contains files that is shared across multiple services.               |


