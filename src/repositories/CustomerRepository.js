const  Customer = require('../models/Customer');

class CustomerRepository {
	async authenticate(data) {
		const res = await Customer.findOne({
			email: data.email,
			password: data.password
		});

		return res;
	}

	async create(data) {
		const customer = new Customer(data);
		await customer.save();
	}

	async getById(id) {
		const res = await Customer.findById(id);

		return res;
	}
}

module.exports = new CustomerRepository();