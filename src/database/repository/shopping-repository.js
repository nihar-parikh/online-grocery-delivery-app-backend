import { customerModel, productModel, orderModel } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';
import { APIError, BadRequestError, STATUS_CODES } from '../../utils/app-errors.js'


//Dealing with data base operations
class ShoppingRepository {

    // payment
    async Orders(customerId) {
        try {
            const orders = await orderModel.find({ customerId }).populate('items.product');
            return orders;
        } catch (err) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Orders')
        }
    }


    async createNewOrder(customerId, txnId) {

        //check transaction for payment Status

        try {
            const profile = await customerModel.findById(customerId).populate('cart.product');

            if (profile) {

                let amount = 0;

                let cartItems = profile.cart;

                if (cartItems.length > 0) {
                    //process Order
                    cartItems.map(item => {
                        amount += parseInt(item.product.price) * parseInt(item.unit);
                    });

                    const orderId = uuidv4();

                    const order = new orderModel({
                        orderId,
                        customerId,
                        amount,
                        txnId,
                        status: 'received',
                        items: cartItems
                    })

                    //clearing customer's cart as he/she placed an order
                    profile.cart = [];

                    order.populate('items.product');
                    const orderResult = await order.save();

                    profile.orders.push(orderResult);

                    await profile.save();

                    return orderResult;
                }
            }

            return {}

        } catch (err) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Category')
        }


    }


}

export { ShoppingRepository };
