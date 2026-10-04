require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const users = require('./routes/users');
const cards = require('./routes/cards');
const mongoose = require('mongoose');
const { createUser, login } = require('./controllers/users');
const auth =require('./middleware/auth');
const { validateCreateUser, validateLogin } = require('./middleware/validation');
const { requestLogger, errorLogger } = require('./middleware/logger');
const helmet = require('helmet');
const cors = require('cors');
const {PORT = 3000} = process.env;
const app = express();

const allowedOrigin = [
    'https://arrounf-frontend.vercel.app/',
    'http://localhost:3000'
]

const limiter = rateLimit({
    windowMs:15*60*100,
    max: 50,
    message: 'demasiadas solicitudes desde esta IP'
})

mongoose.connect(process.env.MONGO_DB);

app.use(helmet());

app.use(cors({origin: allowedOrigin}));

app.use(limiter);

app.use(express.json());

app.use(requestLogger);

app.post('/signup', validateCreateUser, createUser);
app.post('/signin', validateLogin, login);
app.use(auth);
app.use('/users', users);
app.use('/cards', cards);

app.use(errorLogger);

app.use((req, res) => {
    res.status(404).json({"message": "recurso no encontrado"})
});
app.use((err, req, res, next) => {
    if (err.name === 'DocumentNotFoundError') {
            return res.status(404).send({message: 'Elemento no encontrado'});
        }
    const {statusCode = 500, message} = err;
    res.status(statusCode).send({message: statusCode === 500 ? 'Error de servidor' : message})
});

app.listen(PORT, () => {
    console.log(`Server funcionando en ${PORT}`);
});