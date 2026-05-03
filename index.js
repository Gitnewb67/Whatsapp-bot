// Entry point — loads environment variables and starts the server
require('dotenv').config();
const { startServer } = require('./src/server');

startServer();
