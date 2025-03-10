const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: String,
  city: {
    type: String,
    required: [true, 'City is required']
  },
  state: String,
  zipCode: String,
  country: String
}, { _id: false });

const DonationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    quantity: {
      type: Number,
      required: [true, 'Please specify the quantity']
    },
    quantityUnit: {
      type: String,
      required: [true, 'Please specify the unit (e.g., kg, servings, boxes)'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Please specify the type of food'],
      enum: [
        'cooked meal',
        'raw ingredients',
        'packaged food',
        'beverages',
        'bakery',
        'fruits & vegetables',
        'other'
      ]
    },
    expiryDate: {
      type: Date,
      required: [true, 'Please add an expiry date']
    },
    images: [String],
    address: addressSchema,
    status: {
      type: String,
      enum: ['available', 'reserved', 'completed', 'cancelled'],
      default: 'available'
    },
    donor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    recipient: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    dietaryInfo: {
      isVegetarian: {
        type: Boolean,
        default: false
      },
      isVegan: {
        type: Boolean,
        default: false
      },
      isGlutenFree: {
        type: Boolean,
        default: false
      },
      isNutFree: {
        type: Boolean,
        default: false
      },
      isDairyFree: {
        type: Boolean,
        default: false
      }
    },
    pickupTime: {
      start: Date,
      end: Date
    },
    pickupInstructions: String
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add virtual field for time until expiry
DonationSchema.virtual('timeUntilExpiry').get(function() {
  return this.expiryDate ? this.expiryDate - new Date() : null;
});

module.exports = mongoose.model('Donation', DonationSchema); 