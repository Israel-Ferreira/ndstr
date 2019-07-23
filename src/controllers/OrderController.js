const orderRepository = require("../repositories/OrderRepository");
const guid = require('guid')
const authService = require("../services/AuthService");

class OrderController {
	async getAll(req, res, next) {
		try {
			const data = await orderRepository.get();
			res.status(200).send(data);
		} catch (err) {
			res.status(500).send({ message: err });
		}
	}

	async post(req, res, next) {
		const {customer,items} = req.body;
		console.log({customer,items})
		try {
			const token = req.body.token || req.query.token || req.headers['x-access-token'];
			const data = await authService.decodeToken(token);



			await orderRepository.create({
                customer: data.id,
                items,
                number: guid.raw().substring(0,6)
			});
			
			res.status(201).send({ message: "Produto Criado com sucesso" });
		} catch (err) {
			res.status(400).send({ message: "Falha ao cadastrar o produto", data: e });
		}
    }
    
}

module.exports = new OrderController();
