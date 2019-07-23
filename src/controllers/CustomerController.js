const ValidationContract = require("../validators/FluentValidator");
const customerRepository = require("../repositories/CustomerRepository");
const emailService = require("../services/EmailService");

const authService = require("../services/AuthService");

const md5 = require("md5");

class CustomerController {
	async post(req, res, next) {
		let contract = new ValidationContract();

		contract.hasMinLen(
			req.body.name,
			3,
			"O nome deve conter pelo menos 3 caracteres"
		);
		contract.isEmail(req.body.email, "O Email é Inválido");
		contract.hasMinLen(
			req.body.password,
			6,
			"A senha deve conter pelo menos 6 caracteres"
		);

		if (!contract.isValid()) {
			res
				.status(400)
				.send(contract.getErrors())
				.end();
			return;
		}

		try {
			const { name, email, password} = req.body;

			const roles = req.body.roles ? req.body.roles : ["user"]

			await customerRepository.create({
				name,
				email,
				password: md5(password + global.SALT_KEY),
				roles
			});

			emailService.sendEmail(
				email,
				"Bem vindo ao NodeStore",
				global.EMAIL_TMPL.replace("{0}", name)
			);

			res.status(201).send({ message: "Cliente Criado com sucesso" });
		} catch (err) {
			console.log(err);
			res
				.status(400)
				.send({ message: "Falha ao cadastrar o Cliente", data: err });
		}
	}

	async authenticate(req, res, next) {
		try {
			const { name, email, password } = req.body;
			const customer = await customerRepository.authenticate({
				name,
				email,
				password: md5(password + global.SALT_KEY)
			});

			if (!customer) {
				res.status(404).send({ message: "Usuário ou Senha Inválidos" });
				return;
			}

			const token = await authService.generateToken({
				id: customer._id,
				email: customer.email,
				name: customer.name,
				roles: customer.roles
			});

			res.status(201).send({
				token,
				data: {
					email: customer.email,
					name: customer.name
				}
			});
		} catch (err) {
			res
				.status(400)
				.send({ message: "Falha ao cadastrar o Cliente", data: err });
		}
	}

	async refreshToken(req, res, next) {
		try {

			const token = req.body.token || req.query.token || req.headers["x-access-token"];
			const data = await authService.decodeToken(token);

			const customer = await customerRepository.getById(data.id);

			if (!customer) {
				res.status(404).send({ message: "Cliente não encontrado" });
				return;
			}

			const tokenData = await authService.generateToken({
				id: customer._id,
				email: customer.email,
				name: customer.name
				//roles: customer.roles
			});

			res.status(201).send({
				tokenData,
				data: {
					email: customer.email,
					name: customer.name
				}
			});
		} catch (err) {
			res
				.status(400)
				.send({ message: "Falha ao cadastrar o Cliente", data: err });
		}
	}
}

module.exports = new CustomerController();
