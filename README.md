# shopping-backend-nodejs-mongodb
Sample backend application to show how to use NodeJS with MongoDB

Pre req:
- install node
- create a MongoDB cluster

Steps to run the application:
- Create a file named .env in project root folder.
- add the following variables along with their value in .env file (change <...> to actual values):
    NODE_ENV=<dev, test, or prod>
    PORT=<port # that you want to run the server>
    SECURE_KEY=<random key>
    DB_CONNECT=<mongodb connection url>
- run 'nmp install' on root folder of this project
- run node index.js to run the server