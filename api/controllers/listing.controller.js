import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    // if (offer === undefined || offer === 'false') {
    //   offer = { $in: [false, true] };
    // }

    let drama = req.query.drama;

    if (drama === undefined || drama === 'false') {
      drama = { $in: [false, true] };
    }

    let thriller = req.query.thriller;

    if (thriller === undefined || thriller === 'false') {
      thriller = { $in: [false, true] };
    }

    let comedy = req.query.comedy;

    if (comedy === undefined || comedy === 'false') {
      comedy = { $in: [false, true] };
    }

    let action = req.query.action;

    if (action === undefined || action === 'false') {
      action = { $in: [false, true] };
    }

    let adventure = req.query.adventure;

    if (adventure === undefined || adventure === 'false') {
      adventure = { $in: [false, true] };
    }

    let horror = req.query.horror;

    if (horror === undefined || horror === 'false') {
      horror = { $in: [false, true] };
    }

    let romance = req.query.romance;

    if (romance === undefined || romance === 'false') {
      romance = { $in: [false, true] };
    }

    let scifi = req.query.scifi;

    if (scifi === undefined || scifi === 'false') {
      scifi = { $in: [false, true] };
    }

    let historic = req.query.historic;

    if (historic === undefined || historic === 'false') {
      historic = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['english', 'hindi', 'marathi'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      // offer,
      drama,
      thriller,
      comedy,
      action,
      adventure,
      horror,
      romance,
      scifi,
      historic,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};