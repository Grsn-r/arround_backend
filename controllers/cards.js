const Cards = require('../models/cards');
const authError = require('../errors/authError');
const notFounderror = require('../errors/notFoundError');

const getCards = (req, res) => {
    Cards.find({})
    .populate('owner')
    .then(cards => {
    res.status(200).json(cards)
    })
    .catch(err => {
        res.status(500).json({message: err.message})
    });
};

const createCards = (req,res) => {
    const {name, link} = req.body;
    Cards.create({name, link, owner: req.user._id})
    .then(card => {
        res.status(201).json(card);
    })
    .catch(err => {
        console.log('Error:', err);
        res.status(400).json({message: err.message})
    })
}

const getCardsById = (req, res) => {
    const {cardId} = req.params;
    Cards.findById(cardId).orFail()
    .then(card => {
        res.tatus(200).json({card})
    })
    .catch(err => {
        res.tatus(404).json({message: 'Card no encontrada'})
    });
};

const likeCard= async (req, res, next) => {
    try {
        const like = await Cards.findByIdAndUpdate(req.params.cardId, {$addToSet: {likes: req.user._id}},
            {new: true}
        );
        if (!like) {
            throw new notFounderror('tarjeta no encontrada')
        }
        return res.send(like);
    } catch (err) {
        next(err);
    };
};

const dislikeCard = async (req, res) => {
    try {
        const like = await Cards.findByIdAndUpdate(req.params.cardId, {$pull: {likes: req.user._id}},
            {new: true}
        );
        if (!like) {
            return res.status(404).json({message: 'Elemento no encontrado'})
        }
        res.send(like);
    } catch (err) {
        return res.status(500).json({message: 'Error de servidor'});
    };
}

const deleteCard =  (req, res, next) => {
    Cards.findById(req.params.cardId).orFail()
        .then(card => {
            if (card.owner.equals(req.user._id)) {
               return Cards.findByIdAndDelete(req.params.cardId)
               .then(erasedCard => {
                res.status(200).send(erasedCard);
               });
            }
            throw new authError('Error de autorización');
        })
    .catch(next);
};

module.exports = {
    getCards,
    createCards,
    getCardsById,
    likeCard,
    dislikeCard,
    deleteCard
}

