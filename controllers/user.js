const UserService = require("../services/UserServices");

module.exports.getCurrentUser = async function getCurrentUser(req, res, next) {
	const { token } = req;
	let user = null;
	try {
	 	user = await UserService.getUserByToken(token)
	} catch ({ message }) {
		return next({
			status: 500,
			message
		})
	}

	return res.json(user);
}

module.exports.makeAdmin = async function getAllUsers(req, res, next) {
	const { token } = req;
	const { userId } = req.params;
	let user = null;
	try {
	 	user = await UserService.getUserById(userId);
	 	
	 	const { isAdmin } = await UserService.getUserByToken(token);
	 	if(!isAdmin) {
	 		return next({
	 			message: "You are not an admin"
	 		})
	 	}
	 	user.isAdmin = true;
	 	user.save();
	
	} catch ({ message }) {
		return next({
			status: 500,
			message
		})
	}

	return res.json(user);
}

module.exports.getAllUsers = async function getAllUsers(req, res, next) {
	let users = null;
	try {
		users = await UserService.getAllUsers()
	} catch ({ message }) {
		return next({
			status: 500,
			message
		})
	}

	return res.json(users);
}

module.exports.blockUser = async function blockUser(req, res, next) {
	const { token } = req;
	const { userId } = req.params;
	let user = null;
	try {
	 	user = await UserService.getUserById(userId);
	 	const { isAdmin } = await UserService.getUserByToken(token);
	 	if(!isAdmin) {
	 		return next({
	 			message: "You are not an admin"
	 		})
	 	}
	 	user.blocked = true;
	 	user.save();
	} catch ({ message }) {
		return next({
			status: 500,
			message
		})
	}

	return res.json(user);
}