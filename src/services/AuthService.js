const jwt = require("jsonwebtoken");

class AuthService {
	async generateToken(data) {
		return jwt.sign(data, global.SALT_KEY, { expiresIn: "1d" });
	}

	async decodeToken(token) {
		const data = await jwt.verify(token, global.SALT_KEY);
		return data;
	}

	authorize(req, res, next) {
		let token =
			req.body.token || req.query.token || req.headers["x-access-token"];

		if (!token) {
			res.status(401).json({ message: "Acesso Inválido" });
		} else {
			jwt.verify(token, global.SALT_KEY, (error, decoded) => {
				if (error) {
					res.status(401).json({ message: "Token Inválido" });
				} else {
					next();
				}
			});
		}
	}

	isAdmin(req, res, next) {
		const token = req.body.token || req.query.token || req.headers["x-access-token"];

		if (!token) {
			res.status(401).json({ message: "Acesso Inválido" });
		} else {
			jwt.verify(token, global.SALT_KEY, (error, decoded) => {
				if (error) {
					res.status(401).json({ message: "Token Inválido" });
				} else {
                    console.log(decoded.roles);
					if (decoded.roles.includes("admin")) {
						next();
					} else {
						res.status(403).json({
							message: "Esta funcionalidade é restrita para administradores"
						});
					}
				}
			});
		}
	}
}

module.exports = new AuthService();
