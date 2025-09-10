# Compass Store ⬆🖼️
NestJS backend application to handle image upload storing S3 and using DynamoDB for image metadata

[![Build-and-test](https://github.com/carlosdrt1/ANJUN25_D03_COMPASSSTORE/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/carlosdrt1/ANJUN25_D03_COMPASSSTORE/actions/workflows/.github/workflows/build-and-test.yml)
[![lint](https://github.com/carlosdrt1/ANJUN25_D03_COMPASSSTORE/actions/workflows/lint.yml/badge.svg)](https://github.com/carlosdrt1/ANJUN25_D03_COMPASSSTORE/actions/workflows/.github/workflows/lint.yml)
![Node.js](https://img.shields.io/badge/Node.js-22.18.x-brightgreen)
![NestJS](https://img.shields.io/badge/NestJS-Framework-E0234E?logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue?logo=typescript)
![Docker](https://img.shields.io/badge/Docker-Supported-2496ED?logo=docker)
![Jest](https://img.shields.io/badge/Tests-Jest-99425b?logo=jest)


## Running the project 

- Default application url: `http://localhost:3000/api/v1`

### Setup environment variables
Create a `.env` file in the root directory with these variables:

```env
# Application port (default 3000)
PORT=

# Dynamo tables
DYNAMO_USERS_TABLE=
DYNAMO_IMAGES_TABLE=

# AWS credentials
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=

# Only if required
AWS_SESSION_TOKEN=

# Bucket name in S3
AWS_BUCKET_NAME=

# JWT
JWT_SECRET=
```


### Running Locally

Install dependencies

```bash
npm install
```

Running the project

```bash
npm start
```

### Run With Docker

```bash
docker-compose up -d
```

## Project Routes

POST /images/upload -> upload an new image
GET /images -> return all image data paginated
GET /images/export-csv -> export image data to a csv file
DELETE /images/:imageName -> delete an image by name

POST /auth/register -> register a new user
POST /auth/login -> return a token if the login is valid

## Running Unit Tests

To run unit tests, run the following command

```bash
npm test
```

