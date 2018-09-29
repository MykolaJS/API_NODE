const Page = require("../models/page");

const create = async (req, res, next) => {
	const pageData = req.body;
	const userId = req.user._id;

	pageData.userId = userId;
	let page = null;
	try {
		page = await Page.create(pageData);
	} catch ({message}) {
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
	} catch ({message}) {
		return next({
			status: 500,
			message
		})
	}
	res.json(pages);

};

module.exports.create = create;
module.exports.getAll = getAll;