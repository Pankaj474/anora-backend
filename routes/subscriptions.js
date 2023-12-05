const express = require('express');
const { verifyUser } = require('../authenticate');
const { getAllSubscriptions, updateSubscription, createSubscription } = require('../controllers/subscription');
const router = express.Router();

router.get('/', getAllSubscriptions);
router.put('/:id', updateSubscription);
router.post('/',verifyUser,createSubscription);
module.exports = router;