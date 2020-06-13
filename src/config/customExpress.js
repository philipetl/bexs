const express = require('express');
const app = express();

app.use(express.json());

const controllers = require('../controller/Controller');
controllers(app);

module.exports = app;