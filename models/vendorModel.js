const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: String,
    // other vendor properties
  },
  { timestamps: true }
);

const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;
