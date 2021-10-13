const mongoose = require('mongoose');

const PersonFace = mongoose.model('PersonFace', {
    name: String,
    descriptors: Array
});

module.exports = PersonFace;