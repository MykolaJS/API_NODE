const UserService = require("../services/UserServices");

module.exports = async function getCurrentUser(req, res, next) {
	const { token } = req;
	let user = null;
	try {
	 	user = await UserService.getUserByToken(token)
	} catch ({ messege }) {
		return next({
			status: 500,
			messege
		})
	}

	return res.json(user);
}