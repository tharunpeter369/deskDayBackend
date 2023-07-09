const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: String,
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  amount: Number,
  date: Date,
  fully_paid: {
    type: Boolean,
    default: false,
  },
  balance: Number,
},
{ timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;

