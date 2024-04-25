import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings, likeListing } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import Listing from '../models/listing.model.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.post('/:listingId/like', likeListing);
router.get('/get', getListings);
// router.get('/get/:id', verifyToken, getListing);
// router.post('/:listingId/view', viewListing); 
// router.post('/:listingId/track-view', trackView);


export default router;
