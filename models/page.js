const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const PageSchema = new Schema({
	title: { type: String, require: true },
	body: { type: String, require: true },
	createAt: { type: Date, require: true, default: Date.now },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	name: { type: String, ref: "User" }
});

module.exports = mongoose.model("Page", PageSchema);