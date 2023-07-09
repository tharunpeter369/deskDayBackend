const express = require("express");
const router = express.Router();
const venderController = require("../controllers/venderController");

//Get all data
router.get("/", async (req, res) => {
  const data = await venderController.getData();
  res.json(data);
});

// Create a new vendor
router.post("/vendors", async (req, res) => {
  const data = await venderController.createVendor(req.body);
  res.json(data);
});

// Create a new invoice for a vendor
router.post("/invoices", async (req, res) => {
  const data = await venderController.createInvoice(req.body);
  res.json(data);
});

// Create a new payment against an invoice
router.post("/payments", async (req, res) => {
  const data = await venderController.createNewPayment(req.body);
  res.json(data);
});


// Perform reconciliation for a vendor
router.get("/reconciliation", async (req, res) => {
  const data = await venderController.reconciliation();
  res.json(data);
});

module.exports = router;
