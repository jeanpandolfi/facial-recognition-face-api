
const express = require('express');
const mongoose = require('mongoose');
const PersonFace = require('./models/person-face');

const app = express();

app.use( express.urlencoded( { extended: true } ) );

app.use(express.json());

app.listen(3000, '0.0.0.0');

mongoose.connect('mongodb://localhost:27017/person-faces')
.then(() => console.log('Sucessfull conected'))
.catch((error) => console.log('Error connect', error));

app.get('/', (request, response) => {
    response.send({ statusServer: "Server UP"});
})

app.post('/face', async (request, response) => {
    try {
        const personFace = request.body;
        await PersonFace.create(personFace);
        return response.status(201).send({message: `Sucessfull saving PersonFace ${personFace.name}`});
    } catch (error) {
        response.status(400).send({message: `Error saving PersonFace ${personFace.name}`});
    }
});

app.get('/face', async  (request, response) => {
    try {
        const persons = await PersonFace.find();
        response.status(200).send(persons);
    } catch (error) {
        response.status(400).send({message: `Error get all persons`});
    }
} );

app.get('/face/:id', async  (request, response) => {
    try {
        const id = request.params.id;

        // const person = await PersonFace.findById(id);
        const person = await PersonFace.findOne({_id: id});
        if(!person){
            return response.status(422).send({message: `Face Not Found ${id}`});
        }
        response.status(200).send(person);
    } catch (error) {
        response.status(400).send({message: `Error get PersonFace ${id}`});
    }
} );

app.put('/face/:id', async  (request, response) => {
    try {
        const id = request.params.id;
        const personFace = request.body;
        
        await PersonFace.updateOne({_id: id}, personFace);
        response.status(200).send({message: 'Update Sucessfull'});
    } catch (error) {
        response.status(400).send({message: `Error get PersonFace ${id}`});
    }
} );

app.post('/face-all', async (request, response) => {
    try {
        const personFaces = request.body;
        console.log('Body Recebido: ', personFaces)
        await PersonFace.create(personFaces);
        response.status(201).send({message: `Sucessfull saving all PersonFaces. Number faces: ${personFaces.length}`});
    } catch (error) {
        response.status(400).send({message: `Error saving PersonFace ${personFace.name}`});
    }
});

app.get('/face-all', async  (request, response) => {
    try {
        const persons = await PersonFace.find();
        response.status(200).send(persons);
    } catch (error) {
        response.status(400).send({message: `Error get all persons`});
    }
} );