import { ShoppingService } from '../services/shopping-service.js';
import { CustomerService } from '../services/customer-service.js';
import { userAuth } from './middileware/auth.js';

const shopping = (app) => {


    const shoppingService = new ShoppingService();
    const customerService = new CustomerService();

    app.post('/api/v1/shopping/order', userAuth, async (req, res, next) => {

        const { _id } = req.user;
        const { txnNumber } = req.body;

        try {
            const { data } = await shoppingService.placeOrder({ _id, txnNumber });
            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }

    });

    app.get('/api/v1/shopping/orders', userAuth, async (req, res, next) => {

        const { _id } = req.user;

        try {
            const { data } = await customerService.getShopingDetails(_id);
            return res.status(200).json(data.orders);
        } catch (err) {
            next(err);
        }

    });


    app.get('/api/v1/shopping/cart', userAuth, async (req, res, next) => {

        const { _id } = req.user;
        try {
            const { data } = await customerService.getShopingDetails(_id);
            return res.status(200).json(data.cart);
        } catch (err) {
            next(err);
        }
    });
}

export { shopping }
