# mongo-rest-jwt

A template node and express backend made for interacting with a mongoDB database using JWT for authentication and enabling authorization for admins and users.

## Setup and Installation

1. **Download Repository**

   ```sh
   git clone https://github.com/SaschaWebDev/mongo-rest-jwt.git
   cd  mongo-rest-jwt
   ```

2. **Dependency Installation**

   ```sh
   npm install
   ```

3. **MongoDB Connection**

Backend is requiring acces to a MongoDB through Mongoose ORM.

1. **Environmental Variable Configuration**

   ```
    HOSTNAME=localhost
    PORT=3000
    ENVIRONMENT=development
    DEFAULT_ADMIN_PW=

    DB_USERNAME=
    DB_PW=
    DB_HOSTNAME=
    DB_NAME=
    DB_PORT=

    JWT_SECRET=test123
   ```

2. **Application Start**

   - Start with Nodemon for hot-reloading features in development environment

   ```
    npm run server
   ```

   - Start with Node for production environment

   ```
    npm start
   ```

## API Documentation

- Full API documentation with example requests is available in the [provided postman-collection](./template-mongo-rest-jwt.postman_collection.json)
