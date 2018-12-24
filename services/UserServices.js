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

module.exports.getUserById = async function getUserById(_id) {
	let user = null;
	try {
		user = await User.findOne({ _id }, { password: 0 });
	} catch ({message}) {
		throw message;
	}

	return user;
}

module.exports.getAllUsers = async function getAllUsers() {
	let users = null;
	try {
		users = await User.find();
	} catch (e) {
		throw e;
	}

	return users;
}
