const express = require('express');
const router = express.Router();
const { 
    createInterest, 
    getInterestsForListing, 
    updateInterestStatus,
    getMyInterests
} = require('../controllers/interestController');
const { protect } = require('../middleware/auth');

router.get('/mine', protect, getMyInterests);
router.post('/:listingId', protect, createInterest);
router.get('/:listingId', protect, getInterestsForListing);
router.patch('/:id', protect, updateInterestStatus);


module.exports = router;
