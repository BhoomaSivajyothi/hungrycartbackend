const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const router = require("./routers/vendorRouter");
const bodyparse = require("body-parser");
const FirmRouter = require("./routers/firmRouter");
const ProductRouter=require('./routers/productRouter');
const path=require('path')

const app = express();

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`server scussfully started at ${PORT}`);
});

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongodb connected sucessfully"))
  .catch((error) => console.log(error));

app.use("/home", (req, res) => {
  res.send("<h1> welcome node js</h1>");
});

app.use(bodyparse.json());
app.use("/vendor", router);

app.use("/firm", FirmRouter);
app.use('/product',ProductRouter)

app.use('/uploads',express.static('uploads'))