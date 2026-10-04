const {celebrate, Joi} = require('celebrate');
const validator = require('validator');

const validateUrl = (value, helpers) => {
    if (validator.isURL(value)) {
        return value;
    }
    return helpers.error('string.uri');
};

const validateCreateUser = celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2),
        avatar: Joi.string().custom(validateUrl),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    })
});

const validateLogin = celebrate({
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    })
});

const validateUpdateUser = celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2),
    }),
})

const validateUpdateAvatar = celebrate({
    body: Joi.object().keys({
        avatar: Joi.string().custom(validateUrl),
    }),
});

//validar cards

const validateCreateCard = celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        link: Joi.string().required().custom(validateUrl),
    })
});

const validateLikeCard = celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    })
});

module.exports = {
    validateCreateUser,
    validateLogin,
    validateUpdateAvatar,
    validateUpdateUser,
    validateCreateCard,
    validateLikeCard,
}