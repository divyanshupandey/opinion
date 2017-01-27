const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	color: { type: String , required: true },
	partyImgURL: { type: String , required: true }
}, {collection: 'partys', versionKey: false });

const model = mongoose.model('party', schema);

module.exports = {
	PartyModel: model
};
/* beautify preserve:end */
/* beautify ignore:end */
