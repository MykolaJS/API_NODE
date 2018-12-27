const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const Token = require("../models/token");
const config = require("../config");

const singup = async (req, res, next) => {
	const checkUser = await User.findOne({ email: req.body.email });
	let user;
	if (checkUser) {
		return next({
			statu: 400,
			message: "The email address you have entered is already associated with another account."
		})
	}
	try {
		user = new User({ 
		    name: req.body.name, 
		    email: req.body.email, 
		    password: req.body.password 
	    });
	    user.save(err => {
	        if (err) return res.status(500).send({ msg: err.message }); 

	        const token = new Token({ 
	        	_userId: user._id, 
	        	token: crypto.randomBytes(16).toString("hex") 
	        });
	        token.save(err => {
	        	if (err) return res.status(500).send({ msg: err.message });
	            const transporter = nodemailer.createTransport({ 
	            	service: "gmail", 
	            	auth: { 
	            		user: "mvasilkiv21@gmail.com", 
	            		pass: "a4tech123" 
	            	} 
	            });
	            const mailOptions = { 
	            	from: "mvasilkiv21@gmail.com", 
	            	to: user.email, 
	            	subject: "Account Verification Token", 
	            	text: "Hello,\n\n" + "Please verify your account by clicking the link: \nhttp:\/\/" + req.headers.host + "/api/confirmation/" + token.token + ".\n" 
	            };
	            transporter.sendMail(mailOptions,  err => {
	                if (err)  return res.status(500).send({ msg: err.message });
	                res.status(200).send("A verification email has been sent to " + user.email + ".");
	            });
	        });
	    });
	} catch ({ message }) {
		status: 400
		message
	};

	res.json(user);
};

const singin = async (req, res, next) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user) {
		return next({
			status: 400,
			message: "User not found"
		});
	}

	if(!user.isVerified) {
		return next({
			status: 500,
			message: "User Not Verified"
		})
	};

	try {
		const result = await user.comparePasswords(password);
	} catch(e) {
		return next({
			status: 400,
			message: "Bad Credentials" 
		});
	};

	const token = jwt.sign({ _id: user._id }, config.secret);
	res.json(token);
};

const singInFacebook = async (req, res, next) => {
	const { name, socialId, image } = req.body;
	let user = await User.findOne({ socialId });
	if (!user) {
		user = new User({ 
		    name: name, 
			email: socialId,
			password: socialId,
			isVerified: true,
			image,
			socialId
		});

		user.save(err => {
			if (err) return res.status(500).send({ msg: err.message });
	    });
	}

	const token = jwt.sign({ _id: user._id }, config.secret);
	res.json(token);
};

const confirmationPost = async (req, res, next) => {
    const token = await Token.findOne({ token: req.params.token });
    const user = await User.findOne({ _id: token._userId });
    
	if (!token) return res.status(400).send({ 
    	type: "not-verified", 
    	msg: "We were unable to find a valid token. Your token my have expired." 
    });
 
    if (!user) return res.status(400).send({ msg: "We were unable to find a user for this token." });
    if (user.isVerified) return res.status(400).send({
       	type: "already-verified", 
        msg: "This user has already been verified." 
    });
    user.isVerified = true;
    user.save(function (err) {
        if (err)  return res.status(500).send({ msg: err.message });
        res.status(200).send("The account has been verified. Please log in.");
    });     
};


module.exports.singup = singup; 
module.exports.singin = singin;
module.exports.singInFacebook = singInFacebook;
module.exports.confirmationPost = confirmationPost;
