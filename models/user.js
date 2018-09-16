const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');
const bcrypt = require("bcrypt")

const UserSchema = new Schema({
	login: {
		type: String,
		unique: true,
		lowercase: true,
		index: true
	},
	password: String
});

UserSchema.pre("save", async function(next) {
	if (!this.isModified("password")) {
		return next();
	}

	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(this.password, salt);

	this.password = hash;
	next();
})

UserSchema.methods.comparePasswords = function(password) {
	return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User