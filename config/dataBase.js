const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/deskDay1";

const db = async () => {
  mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB database connected successfully.");
    })
    .catch((err) => console(err));
};

module.exports = db;
