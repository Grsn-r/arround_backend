const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authError = require('../errors/authError');
const notFounderror = require('../errors/notFoundError');

const getUser = (req, res, next) => {
    User.findById(req.user._id)
    .then(user => {
        if (!user) {
            throw new notFounderror('Elemento no encontrado');
        }
        const {_id, name, about, avatar, email} = user;
        return res.status(200).json(user);
    })
    .catch(next);
}

const createUser = (req, res, next) => {
    const {name, about, avatar, email, password} = req.body;
    bcrypt.hash(req.body.password, 10)
    .then(hash => User.create({name, about, avatar, email, password: hash}))
    .then(() => {
        return res.status(201).send({message: 'usuario registrado'})
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
    try {
    const {name, about} = req.body;
    const userId = req.user._id;

    return User.findByIdAndUpdate(userId, {name, about},{
            new: true,
            runValidators: true,
        })
        .then(userInfo => {
            if (!userInfo) {
                throw new notFounderror('Usuario no encontrado');
            }
            return res.status(200).json(userInfo);
        })
        .catch(next);
    }
    catch (err) {
        next(err);
    }
};

const updateAvatar = (req, res, next) => {
    try {
        const {avatar} = req.body;
        const userId = req.user._id;
        return User.findByIdAndUpdate(userId, {avatar}, {
            new: true,
            runValidators: true
        })
        .then(userAvatar => {
            if (!userAvatar) {
                throw new notFounderror('Usuario no encontrado');
            }
            return res.status(200).json(userAvatar)
        })
    } catch (err) {
        next(err)
    };
};

const login = (req, res, next) => {
    const {email, password} = req.body;
    User.findOne({email}).select('+password')
    .then(user => {
        if (!user) {
            throw new authError('Correo o contraseña incorrectos');
        }
        return bcrypt.compare(password, user.password)
        .then((matched) => {
            if (!matched) {
                throw new authError('Correo o contraseña incorrectos');
            }
            const token = jwt.sign({_id: user._id}, process.env.NODE_ENV === 'production' ? process.env.JWT_KEY : 'false-hope', {expiresIn: '7d'});
            return res.send({token});
        })
    })
    .catch(next);
};

module.exports = {
    createUser,
    updateUser,
    updateAvatar,
    login,
    getUser,
};