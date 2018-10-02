const Page = require("../models/page");
const User = require("../models/user");

const create = async (req, res, next) => {
	const pageData = req.body;
	const userId = req.user._id;

	pageData.userId = userId;
	let page = null;
	try {
		page = await Page.create(pageData);
	} catch ({ message }) {
		return next({
			status: 400,
			message
		});
	}

	res.json(page);
}; 

const getAll = async (req, res, next) => {
	let pages = null;
	try {
		pages = await Page.find({});
	} catch ({ message }) {
		return next({
			status: 500,
			message
		})
	}
	res.json(pages);

};

const getPagesByUserLogin = async (req, res, next) => {
	const { login } = req.params;
	let user = null;
	let pages = null;

	try {
		user = await User.findOne({ login });
	} catch ({ message }) {
		return next({
			status: 500,
			message
		})
	}

	if(!user) {
		return next({
			status: 404,
			message: "User not found"
		});
	}

	try {
		pages = await Page.find({ userId: user._id });
	} catch ({ message }) {
		return next({
			status: 500,
			message
		})
	}

	res.json({ pages });
}

const deletePage = async (req, res, next) => {
	const _id = req.params.id;
	const userId = req.user._id;
	let page = null;

	try {
		page = await Page.findOne({ _id })
	} catch ({ message }) {
		return next({
			status: 500,
			message
		})
	}

	if (!page) {
		return next({
			status: 404,
			message: "Page not found"
		});
	}

	if (userId.toString() !== page.userId.toString()) {
		return next({
			status: 403,
			message: "Permission denied"
		});
	}

	try {
		page.remove();
	} catch ({message}) {
		return next({
			status: 500,
			message
		})
	}

	return res.json({ message: "success" })
}

module.exports.create = create;
module.exports.getAll = getAll;
module.exports.getPagesByUserLogin = getPagesByUserLogin;
module.exports.deletePage = deletePage;