const User = require("../models/user");

const singup = async (req, res, next) => {
	const credentials = req.body;
	let user;
	try {
		console.log(User)
		user = await User.create(credentials);
	} catch (e) {
		return next(e);
	}

	res.json(user);
};

const singin = (req, res, next) => {
	res.json('singin');
};

module.exports.singup = singup; 
module.exports.singin = singin;