import { CustomerService } from '../services/customer-service.js';
import { ProductService } from '../services/product-service.js';
import { userAuth } from './middileware/auth.js';

const customer = (app) => {

    const customerService = new CustomerService();
    const productService = new ProductService();

    app.post('/api/v1/customer/signup', async (req, res, next) => {
        try {
            const { email, password, phone } = req.body;
            const { data } = await customerService.signUp({ email, password, phone });
            return res.json(data);

        } catch (err) {
            next(err)
        }

    });

    app.post('/api/v1/customer/login', async (req, res, next) => {

        try {

            const { email, password } = req.body;

            const { data } = await customerService.logIn({ email, password });

            return res.json(data);

        } catch (err) {
            next(err)
        }

    });

    app.post('/api/v1/customer/address', userAuth, async (req, res, next) => {

        try {

            const { _id } = req.user;

            const { street, postalCode, city, country } = req.body;

            const { data } = await customerService.addNewAddress(_id, { street, postalCode, city, country });

            return res.json(data);

        } catch (err) {
            next(err)
        }


    });

    app.get('/api/v1/customer/profile', userAuth, async (req, res, next) => {

        try {
            const { _id } = req.user;
            const { data } = await customerService.getProfile({ _id });
            return res.json(data);

        } catch (err) {
            next(err)
        }
    });

    app.put('/api/v1/customer/wishlist', userAuth, async (req, res, next) => {

        const customerId = req.user._id;
        const productId = req.body.productId;

        try {
            const product = await productService.getProductById(productId);
            const wishList = await customerService.addToWishlist(customerId, product)
            return res.status(200).json(wishList);
        } catch (err) {
            next(err)
        }
    });

    app.get('/api/v1/customer/wishlist', userAuth, async (req, res, next) => {
        try {
            const customerId = req.user._id;
            const { data } = await customerService.getWishList(customerId);
            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }
    });

    app.get('/api/v1/customer/all', userAuth, async (req, res, next) => {
        try {
            const { tableName, query } = req.body;
            const { data } = await customerService.getAllCustomers({ tableName, query });

            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }
    });
}

export { customer }