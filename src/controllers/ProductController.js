const ValidationContract = require('../validators/FluentValidator');
const productRepository =  require('../repositories/ProductRepository');
const guid = require('guid');

const config = require('../config');
const azure = require("azure-storage");

class ProductController {
	async getAll(req, res, next) {
		try{
			const data = await productRepository.getAll();
			res.status(200).send(data)
		}catch(err){
			res.status(500).send({message:err})
		}
	}

	async getBySlug(req, res, next) {
		try{
			const { slug } = req.params;
			const data = await productRepository.getBySlug(slug)
			res.status(200).send(data)
		}catch(err){
			res.status(400).send(err);
		}
	}

	async getById(req, res, next) {
		try{
			const { id } = req.params;
			const data = await productRepository.getById(id);
			res.status(200).send(data)
		}catch(err){
			res.status(400).send(err);
		}
	}

	async getByTag(req, res, next) {
		try{
			const { tag } = req.params;
			const data =  await productRepository.getByTag(tag)
			res.status(200).send(data)
		}catch(err){
			res.status(400).send(err)
		}
	}

	async post(req, res, next) {
		let contract = new ValidationContract();

		contract.hasMinLen(req.body.title,3,'O titulo deve conter pelo menos 3 caracteres');
		contract.hasMinLen(req.body.slug,3,"O slug deve conter pelo menos 3 caracteres");
		contract.hasMinLen(req.body.description,3,"A descrição deve conter pelo menos 3 caracteres");


		if(!contract.isValid()){
			res.status(400).send(contract.getErrors()).end();
			return;
		}

		try{
			const blobSvc = azure.createBlobService(config.containerConnectionString);

			let filename= guid.raw() + '.jpg';
			let rawdata = req.body.image;
			let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
			let type = matches[1];
			let buffer = new Buffer(matches[2],'base64');

			await blobSvc.createBlockBlobFromText('product-images',filename,buffer,{
				contentSettings: {
					contentType: type
				}
			}, (error,result,response) => {
				if(error){
					filename = "default-product.png";
				}
			});

			let {tags,title,slug,description,price} = req.body;

			await productRepository.create({
				image:`https://ndstr2.blob.core.windows.net/product-images/${filename}`,
				tags,
				title,
				slug,
				description,
				price
			});


			res.status(201).send({ message: "Produto Criado com sucesso" })
		}catch(err){
			res.status(400).send({ message: "Falha ao cadastrar o produto", data: e })
		}
	}

	async put(req, res, next) {
		try{
			const { id } = req.params;
			await productRepository.put(id,req.body);
			res.status(200).send({ message: "Produto atualizado com sucesso" })
		}catch(err){
			res.status(400).send({ message: "Falha ao atualizar o produto", data: err })
		}
	}

	async delete(req, res, next) {
		try{
			const {id} = req.params;
			await productRepository.delete(id)
			res.status(200).send({ message: "Produto Excluido com sucesso" })
		}catch(err){
			res.status(500).send({ message: "Falha ao excluir o produto ", data: err})
		}
	}
}

module.exports = new ProductController();
