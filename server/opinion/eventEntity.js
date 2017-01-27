const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	eventName: { type: String, required: true, unique: true },
	eventType: { type: String , required: true },
	year: { type: Number , required: true },
	parties: { type: Array , required: true }
}, {collection: 'events', versionKey: false});

const model = mongoose.model('event', schema);

module.exports = {
	EventModel: model
};
/* beautify preserve:end */
/* beautify ignore:end */
