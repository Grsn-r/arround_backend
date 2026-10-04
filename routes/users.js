const router = require('express').Router();
const { getUser, updateUser, updateAvatar} = require('../controllers/users');
const { validateUpdateUser, validateUpdateAvatar } = require('../middleware/validation');

router.get('/me', getUser);

router.patch('/me', validateUpdateUser, updateUser );

router.patch('/me/avatar', validateUpdateAvatar, updateAvatar );

module.exports = router;