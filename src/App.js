const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const config = require("./config");

const indexRouter = require("./routes/index");
const productRouter = require("./routes/ProductRoutes");
const customerRouter = require("./routes/CustomerRoute");
const ordersRouter = require("./routes/OrderRoute");

const app = express();

mongoose.connect(config.connectionString, { useNewUrlParser: true });

app.use(
	bodyParser.json({
		limit: "5mb"
	})
);

app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, x-access-token");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
});

app.use("/", indexRouter);
app.use("/products", productRouter);
app.use("/customers", customerRouter);
app.use("/orders", ordersRouter);

module.exports = app;
