const {model,Schema} = require('mongoose');

const customerSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	roles: [
		{
			type: String,
			required: true,
			enum: ["user", "admin"],
			default: "user"
		}
	]
});

module.exports = model('Customer',customerSchema)