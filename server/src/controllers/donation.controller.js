const Donation = require('../models/Donation');

// @desc    Create a new donation
// @route   POST /api/donations
// @access  Private
exports.createDonation = async (req, res) => {
  try {
    // Add user to req.body
    req.body.donor = req.user.id;
    
    // Validate required fields
    if (!req.body.address || !req.body.address.city) {
      return res.status(400).json({
        success: false,
        message: 'City is required in the address'
      });
    }

    console.log('Creating donation with data:', req.body);
    
    const donation = await Donation.create(req.body);

    res.status(201).json({
      success: true,
      data: donation
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get all donations
// @route   GET /api/donations
// @access  Public
exports.getDonations = async (req, res) => {
  try {
    let query;
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Donation.find(JSON.parse(queryStr)).populate({
      path: 'donor',
      select: 'name organization'
    });

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Donation.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const donations = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: donations.length,
      pagination,
      data: donations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single donation
// @route   GET /api/donations/:id
// @access  Public
exports.getDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate({
      path: 'donor',
      select: 'name organization'
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: `Donation not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: donation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update donation
// @route   PUT /api/donations/:id
// @access  Private
exports.updateDonation = async (req, res) => {
  try {
    let donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: `Donation not found with id of ${req.params.id}`
      });
    }

    // Make sure user is donation owner
    if (donation.donor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this donation`
      });
    }

    donation = await Donation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: donation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete donation
// @route   DELETE /api/donations/:id
// @access  Private
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: `Donation not found with id of ${req.params.id}`
      });
    }

    // Make sure user is donation owner
    if (donation.donor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this donation`
      });
    }

    await donation.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reserve a donation
// @route   PUT /api/donations/:id/reserve
// @access  Private
exports.reserveDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: `Donation not found with id of ${req.params.id}`
      });
    }

    // Check if donation is already reserved
    if (donation.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `Donation is not available for reservation`
      });
    }

    // Update donation status
    donation.status = 'reserved';
    donation.recipient = req.user.id;
    
    await donation.save();

    res.status(200).json({
      success: true,
      data: donation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 