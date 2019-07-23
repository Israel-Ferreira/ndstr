const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const orderSchema = new Schema({
	number: {
		type: String,
		required: true
	},
	createDate: {
		type: Date,
		required: true,
		default: Date.now
	},
	status: {
		type: String,
		required: true,
		enum: ["created", "done"],
		default: "created"
	},
	customer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Customer"
	},
	items: [{
        quantity:{
            type: Number,
            required: true,
            default: 1   
        },
        price: {
            type: Number,
            required: true
        },
	    product: {
		    type: mongoose.Schema.Types.ObjectId,
			ref: "Product"
		}
	}]
});

module.exports = model("Order", orderSchema);
