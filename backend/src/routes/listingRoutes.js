const express = require('express');
const router = express.Router();
const { 
    createListing, 
    getListings, 
    getListingById, 
    deleteListing 
} = require('../controllers/listingController');
const { protect } = require('../middleware/auth');
const { validate, listingSchema } = require('../middleware/validator');

router.post('/', protect, validate(listingSchema), createListing);
router.get('/', getListings);
router.get('/:id', getListingById);
router.delete('/:id', protect, deleteListing);


module.exports = router;
