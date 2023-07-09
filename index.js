const express = require("express");
const app = express();
const venderRouter = require("./routes/venderRouter");
const port = 3001;
const mongodb = require('./config/dataBase')
app.use(express.json());

app.use(logger);
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

//db setup
mongodb()
//routes setup
app.use("/api/v1/vender", venderRouter);

app.listen(port, () => {
  console.log(`backend server is running on port ${port}`);
});
