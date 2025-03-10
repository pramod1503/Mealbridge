const express = require('express');
const {
  getDonations,
  getDonation,
  createDonation,
  updateDonation,
  deleteDonation,
  reserveDonation
} = require('../controllers/donation.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router
  .route('/')
  .get(getDonations)
  .post(protect, createDonation);

router
  .route('/:id')
  .get(getDonation)
  .put(protect, updateDonation)
  .delete(protect, deleteDonation);

router.route('/:id/reserve').put(protect, authorize('recipient'), reserveDonation);

module.exports = router; 