const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["active", "inactive"],
      require: true,
      default: "active",
    },
    category_name: {
      type: String,
      require: true,
    },
    icon: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
