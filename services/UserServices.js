const User = require("../models/user");

module.exports.getUserByToken = async function getUserByToken(token) {
	const { _id } = token;
	let user = null;
	try {
		user = await User.findOne({ _id }, { password: 0 });
	} catch (e) {
		throw e;
	}

	return user;
} 