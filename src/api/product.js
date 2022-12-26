import ProductService from '../services/product-service.js';
import CustomerService from '../services/customer-service.js';
import userAuth from './middlewares/auth';

const product = (app) => {

    const service = new ProductService();
    const customerService = new CustomerService();


    app.post('/product/create', async (req, res, next) => {

        try {
            const { name, desc, type, unit, price, available, suplier, banner } = req.body;
            // validation
            const { data } = await service.CreateProduct({ name, desc, type, unit, price, available, suplier, banner });
            return res.json(data);

        } catch (err) {
            next(err)
        }

    });
}