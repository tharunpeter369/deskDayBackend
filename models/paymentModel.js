const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    amountPaid: Number,
    date: Date,
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
