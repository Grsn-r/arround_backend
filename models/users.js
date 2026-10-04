const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 30,
        default: "Jacques Cousteau"
    },
    about: {
        type: String,
        minlength: 2,
        default: 'Explorador'
    },
    avatar: {
        type: String,
        default: 'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Formato de email inválido'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    }
})

module.exports = mongoose.model('user', userSchema);