const jwt = require("jsonwebtoken");

const config = require("../config");

module.exports = async (req, res, next) => {
	const token = req.headers["authorization"];
	let tokenObj = null;

	if(!token) {
		return res
			.status(403)
			.json({ message: "Forbidden. No token!" });
	}

	try {
		tokenObj = jwt.verify(token, config.secret);
	} catch ({ message }) {
		return res
			.status(400)
			.json({ message });
	}

	console.log(tokenObj)
	next()
}