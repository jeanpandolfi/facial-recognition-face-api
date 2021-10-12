const mongoose = require('mongoose');

const PersonFace = mongoose.model('PersonFace', {
    name: String,
    facial_stitches: Number,
    authorized: Boolean
});

module.exports = PersonFace;