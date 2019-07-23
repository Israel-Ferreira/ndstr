const Order = require('../models/Order');

class OrderRepository {
    async get(){
        const resp = await Order.find({})
            .populate('customer','name')
            .populate('items.product','title');
        return resp;
    }

    async create(data){
        const order = new Order(data);
        await order.save();
    }
}

module.exports = new OrderRepository();