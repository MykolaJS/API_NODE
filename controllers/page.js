const OneSignal = require("onesignal-node") ; 

const Page = require("../models/page");
const User = require("../models/user");

const myClient = new OneSignal.Client({    
   userAuthKey: "MWY1MTllZGItOGUyNy00ZTY3LWE5OGMtZGIxNmYwZjk4NDZ",       
   app: { appAuthKey: 'N2ZlZjdkOGQtM2QzZi00M2IyLWFiNTItZGEyZjdlMWJhNzI3', appId: '3732f321-f09f-4b83-b524-d77567d9a98e' }    
});

const firstNotification = new OneSignal.Notification({    
    contents: {    
        en: "",    
        tr: ""   
    },  
    included_segments: ["Active Users", "Inactive Users"]  
});    

const create = async (req, res, next) => {
	const pageData = req.body; 
	const userId = req.user._id;
	const userName = req.user.name;

	pageData.name = userName;
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
	firstNotification.postBody["contents"] = {"en": ` User ${userName} Create Post` };
	myClient.sendNotification(firstNotification, async (err, httpResponse, data) => {
		try {
			console.log(data, httpResponse.statusCode);
		} catch(err) {
			console.log(err);   
		}
	});    

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