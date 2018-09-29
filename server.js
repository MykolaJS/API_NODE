const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const bluebird = require("bluebird");

const config = require("./config");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const pageRoute = require("./routes/page");
const errorHandler = require("./middlewares/errorHandler");
const checkToken = require("./middlewares/checkToken");
const getUser = require("./middlewares/getUser");


const app = express();

mongoose.Promise = bluebird;
mongoose.connect( process.env.MONGODB_URI || config.database, err => {
	if(err) console.log(err);

	console.log("Mongo Connect");
})

app.listen(process.env.PORT || config.port, err => {
	if (err) console.log(err);

	console.log(`Server listening on port ${config.port}`);
});

app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	resave: true,
	saveUnitialized: true,
	secret: config.secret
}));

app.use("/api", authRoute);
app.use("/api", checkToken, userRoute);
app.use(getUser);
app.use("/api", checkToken, pageRoute);

app.use(errorHandler);
