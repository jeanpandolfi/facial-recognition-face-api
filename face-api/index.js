
const express = require('express');
const mongoose = require('mongoose');
const PersonFace = require('./models/person-face');

const PORT = 3000;
const HOST = '0.0.0.0';

const app = express();

app.use( express.urlencoded( { extended: true } ) );

app.use(express.json());

app.listen(PORT, HOST);

mongoose.connect('mongodb://localhost:27017/person-faces')
.then(() => console.log('Sucessfull conected'))
.catch((error) => console.log('Error connect', error));

app.get('/', (request, response) => {
    response.send({ statusServer: "Server UP"});
})

app.post('/save', async (request, response) => {
    try {
        const personFace = request.body;
        await PersonFace.create(personFace);
        return response.status(201).send({message: `Sucessfull saving PersonFace ${personFace.name}`});
    } catch (error) {
        response.status(400).send({message: `Erro saving PersonFace ${personFace.name}`});
    }
});


