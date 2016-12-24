'use strict';

const express = require('express');
const app = express();
const port = 80;

app.get('/', (request, response) => {
    response.send('Hello world!');
});

app.listen(port, () => {
    console.log('Server listening on port ' + port + '!');
});