const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String , required: true, unique: true },
	password: { type: String , required: true },
	type: { type: String , required: true }
}, {collection: 'users', versionKey: false });

const model = mongoose.model('user', schema);

module.exports = {
	UserModel: model
};
/* beautify preserve:end */
/* beautify ignore:end */
