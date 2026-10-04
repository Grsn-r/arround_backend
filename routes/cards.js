const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { getCards,createCards, getCardsById, deleteCard, likeCard, dislikeCard, } = require('../controllers/cards');
const { validateCreateCard, validateLikeCard } = require('../middleware/validation');

router.get('/', getCards);

router.get('/:id', getCardsById);

router.post('/', validateCreateCard, createCards);

router.delete('/:cardId' , deleteCard);

router.delete('/:cardId/likes', validateLikeCard, dislikeCard);

router.put('/:cardId/likes', validateLikeCard, likeCard);

module.exports = router;