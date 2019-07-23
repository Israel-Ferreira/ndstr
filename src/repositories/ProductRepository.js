const Product = require("../models/Product");

class  ProductRepository {
    async getAll(){
        const res = await Product.find({ active: true }, "title price slug");
        return res;
    }

    async getBySlug(slug){
        const res = await Product.findOne({ slug, active: true },"title description price slug tags");
        return res;
    }

    async getByTag(tag){
        const res = await Product.find({ tags: tag, active: true },"title description price slug tags");
        return res;
    }

    async getById(id){
        const res = await Product.findById(id);
        return res;
    }

    async create(data){
        const product =  new Product(data);
        await product.save()
    }

    async put(id, data){
        const { title, description, price, slug } = data;
        await Product.findByIdAndUpdate(id, {$set: { title, description, price, slug }});
    }

    async delete(id){
        await Product.findOneAndRemove(id);
    }


}

module.exports = new ProductRepository()