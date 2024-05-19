const express = require('express');
const roots = require('./roots');

function roots1 (app) {


const router = express.Router();
app.use(roots);
app.use('/', router);


}

module.exports = roots1;