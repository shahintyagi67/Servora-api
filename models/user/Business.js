const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  provider_type: {
    type: String,
    required: true,
    enum: ["INDIVIDUAL", "BUSINESS"],
  },
  business_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  offer_type: {
    type: String,
    enum: ["HOME", "AT LOCATION", "HYBRID"],
  },
  business_documents: {
    type: {
      documents: [String],
      documnent_id: String,
    },
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  location_details: {
    place_number: {
      type: String,
    },
    floor: {
      type: String,
    },
    area: {
      type: String,
    },
    city: {
      type: String,
    },
    landmark: {
      type: String,
    },
  },
  businessImage: {
    type: [String],
  },
  flayer: {
    type: String,
  },
  business_timing: [
    {
      days: {
        type: String,
        enum: [
          "SUNDAY",
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THUSDAY",
          "FRIDAY",
          "SATURDAY",
        ],
        is24hours: {
          type: Boolean,
        },
        isClosed: {
          type: Boolean,
        },
        openTime: {
          type: String,
        },
        closeTime: {
          type: String,
        },
      },
    },
  ],
  services:{
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category'
    },
    subcategory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'subcategory'
    }]
  },
  business_plan: [
    {
      plan_name: {
        type: String,
      },
      plan_description: {
        type: String,
      },
      plan_price: {
        type: String,
      },
      plan_image: {
        type: String,
      },
    },
  ],
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  },
});
businessSchema.index({ "location.coordinates": "2dsphere" });
const Business = mongoose.model("Business", businessSchema);
module.exports = Business;
