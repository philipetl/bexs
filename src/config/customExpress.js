const express = require('express');
const app = express();

app.use(express.json());

const routes = require('../app/Controller');
routes(app);

module.exports = app;