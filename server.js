const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const bluebird = require("bluebird");

const config = require("./config");
const authRoute = require("./routes/auth");
const errorHandler = require("./middlewares/errorHandler");
const checkToken = require("./middlewares/checkToken");


const app = express();

mongoose.Promise = bluebird;
mongoose.connect(config.database, err => {
	if(err) console.log(err);

	console.log("Mongo Connect");
})

app.listen(config.port, err => {
	if (err) console.log(err);

	console.log(`Server listening on port ${config.port}`);
});

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	resave: true,
	saveUnitialized: true,
	secret: config.secret
}));

app.use("/api", authRoute);
app.get("/test", checkToken, (req, res) => {
	res.json("test");
})

app.use(errorHandler);
