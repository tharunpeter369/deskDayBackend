const Invoice = require("../models/invoiceModel");
const Payment = require("../models/paymentModel");
const Vendor = require("../models/vendorModel");

//test
const getData = async () => {
  return { name: "testing" };
};

// Create a new vendor
const createVendor = async (venderData) => {
  try {
    const { name } = venderData;
    const vendor = new Vendor({ name });
    let res = await vendor.save();
    return res;
  } catch (error) {
    console.error("Error creating vendor:", error);
    return { error: "Failed to create vendor" };
  }
};

// Create a new payment against an invoice
const createInvoice = async (invoiceData) => {
  try {
    const {
      vendorId,
      invoiceNumber,
      amount,
      date,
      balance = amount,
    } = invoiceData;
    const invoice = new Invoice({
      vendorId,
      invoiceNumber,
      amount,
      date,
      balance,
    });
    let res = await invoice.save();
    return res;
  } catch (error) {
    console.error("Error creating invoice:", error);
    return { error: "Failed to create invoice" };
  }
};

const findInvoice = async (invoiceId) => {
  try {
    let res = await Invoice.findOne({ _id: invoiceId });
    return res;
  } catch (error) {
    return { error: "Failed to find invoice" };
  }
};

//update invoice
const updateInvoice = async (invoiceId, data) => {
  try {
    let updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: invoiceId },
      { $set: data }
    );
    return updatedInvoice;
  } catch (error) {
    res.status(500).json({ error: "Failed to update" });
  }
};

// Create a new payment against an invoice
const createNewPayment = async (paymentData) => {
  try {
    const { invoiceId, amountPaid, date, vendorId } = paymentData;
    const payment = new Payment({ invoiceId, amountPaid, date, vendorId });
    //update the invoice with balance and if fully paid status
    let findInvoiceData = await findInvoice(invoiceId);
    if (!findInvoiceData.fully_paid) {
      let balanceAmont = findInvoiceData.balance - amountPaid;
      let fullyPaid;
      if (balanceAmont > 0) {
        fullyPaid = false;
      } else {
        fullyPaid = true;
      }
      let data = { balance: balanceAmont, fully_paid: fullyPaid };
      let res = await payment.save();
      let updateInvoiceData = await updateInvoice(invoiceId, data);
      return res;
    } else {
      return { error: "Fully paid" };
    }
    // res.json(payment);
  } catch (error) {
    console.error("Error creating payment:", error);
    return { error: "Failed to create payment" };
  }
};


const reconciliation = async () => {
  try {
    // const vendors = await Vendor.find();
    // const reconciliationResult = [];
    // for (const vendor of vendors) {
    //   const invoices = await Invoice.find({ vendorId: vendor._id });
    //   const vendorReconciliation = {
    //     vendor,
    //     invoices: [],
    //   };
    //   for (const invoice of invoices) {
    //     const payments = await Payment.find({ invoiceId: invoice._id });
    //     const invoiceWithPayments = {
    //       ...invoice.toObject(),
    //       payments,
    //     };
    //     vendorReconciliation.invoices.push(invoiceWithPayments);
    //   }
    //   reconciliationResult.push(vendorReconciliation);
    // }

    const reconciliationResult = await Vendor.aggregate([
      {
        $lookup: {
          from: 'invoices',
          localField: '_id',
          foreignField: 'vendorId',
          as: 'invoices',
        },
      },
      {
        $lookup: {
          from: 'payments',
          localField: 'invoices._id',
          foreignField: 'invoiceId',
          as: 'payments',
        },
      },
      {
        $addFields: {
          invoices: {
            $map: {
              input: '$invoices',
              as: 'invoice',
              in: {
                $mergeObjects: [
                  '$$invoice',
                  {
                    payments: {
                      $filter: {
                        input: '$payments',
                        as: 'payment',
                        cond: {
                          $eq: ['$$payment.invoiceId', '$$invoice._id'],
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          invoices: 1,
        },
      },
    ]);

    // const reconciliationResult = await Vendor.aggregate([
    //   {
    //     $lookup: {
    //       from: "invoices",
    //       localField: "_id",
    //       foreignField: "vendorId",
    //       as: "invoicess",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "payments",
    //       localField: "_id",
    //       foreignField: "vendorId",
    //       as: "pay",
    //     },
    //   },
    //   {
    //     $project: {
    //       "invoices.payments.vendorId": 0,
    //       "invoices.payments.invoiceId": 0,
    //     },
    //   },
    // ]);

    return reconciliationResult;
  } catch (error) {
    console.error("Error performing reconciliation:", error);
    return { error: "Failed to perform reconciliation" };
  }
};

module.exports = {
  getData,
  createVendor,
  createInvoice,
  createNewPayment,
  reconciliation,
};



// sample output  of reconciliation
// [
//   {
//       "_id": "64aaa804f6f1b435bcbfe3fc",
//       "name": "tharun",
//       "invoices": [
//           {
//               "_id": "64aaa82ef6f1b435bcbfe3fe",
//               "invoiceNumber": "11",
//               "vendorId": "64aaa804f6f1b435bcbfe3fc",
//               "amount": 2000,
//               "date": "2023-11-05T18:30:00.000Z",
//               "fully_paid": false,
//               "balance": 1000,
//               "createdAt": "2023-07-09T12:29:34.226Z",
//               "updatedAt": "2023-07-09T12:34:28.641Z",
//               "__v": 0,
//               "payments": [
//                   {
//                       "_id": "64aaa954a5797f676c5a10d8",
//                       "invoiceId": "64aaa82ef6f1b435bcbfe3fe",
//                       "vendorId": "64aaa804f6f1b435bcbfe3fc",
//                       "amountPaid": 1000,
//                       "date": "2023-11-05T18:30:00.000Z",
//                       "createdAt": "2023-07-09T12:34:28.632Z",
//                       "updatedAt": "2023-07-09T12:34:28.632Z",
//                       "__v": 0
//                   }
//               ]
//           },
//           {
//               "_id": "64aaad1c4e70d79d2db4e53b",
//               "invoiceNumber": "12",
//               "vendorId": "64aaa804f6f1b435bcbfe3fc",
//               "amount": 3000,
//               "date": "2023-11-05T18:30:00.000Z",
//               "fully_paid": false,
//               "balance": 1500,
//               "createdAt": "2023-07-09T12:50:36.255Z",
//               "updatedAt": "2023-07-09T12:51:04.571Z",
//               "__v": 0,
//               "payments": [
//                   {
//                       "_id": "64aaad384e70d79d2db4e53d",
//                       "invoiceId": "64aaad1c4e70d79d2db4e53b",
//                       "vendorId": "64aaa804f6f1b435bcbfe3fc",
//                       "amountPaid": 1500,
//                       "date": "2023-11-05T18:30:00.000Z",
//                       "createdAt": "2023-07-09T12:51:04.567Z",
//                       "updatedAt": "2023-07-09T12:51:04.567Z",
//                       "__v": 0
//                   }
//               ]
//           }
//       ]
//   },
//   {
//       "_id": "64aaac2d496ab43f454cc2a1",
//       "name": "ashik",
//       "invoices": []
//   }
// ]
