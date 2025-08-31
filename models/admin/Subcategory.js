const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["active", "inactive"],
      require: true,
      default: "active",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subcategory_name: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subcategory", subcategorySchema);
