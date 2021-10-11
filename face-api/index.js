
const express = require('express');

const PORT = 3000;
const HOST = '0.0.0.0';

const app = express();
app.listen(PORT, HOST);

app.get('/', (request, response) => {
    response.send('Hello World!!');
})