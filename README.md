# deskDayBackendTest


1.git clone <repository-url>

2.Install dependencies: npm install

3.Start the Express app: npm start


<!-- API for the postman -->

1. create vendor
POST   http://localhost:3001/api/v1/vender/vendors
{
    "name":"john"
}


2. create invoice
POST   http://localhost:3001/api/v1/vender/invoices

{
    "vendorId":"64aaa804f6f1b435bcbfe3fc",
    "invoiceNumber":12,
    "amount":3000,
    "date":"11/6/2023"
}

3. create payment
POST   http://localhost:3001/api/v1/vender/invoices

{
    "vendorId":"64aaa804f6f1b435bcbfe3fc",
    "invoiceId":"64aaad1c4e70d79d2db4e53b",
    "amountPaid":1500,
    "date":"11/6/2023"
}

4. reconcilation
GET   http://localhost:3001/api/v1/vender/reconciliation