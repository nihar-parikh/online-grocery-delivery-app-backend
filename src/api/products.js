import { ProductService } from '../services/product-service.js';
import { CustomerService } from '../services/customer-service.js';
// import userAuth from './middlewares/auth';

const products = (app) => {

    const productService = new ProductService();
    const customerService = new CustomerService();


    app.post('/api/v1/product/create', async (req, res, next) => {

        try {
            const { name, description, type, unit, price, available, suplier, banner } = req.body;
            // validation
            const { data } = await productService.createProduct({ name, description, type, unit, price, available, suplier, banner });
            return res.json(data);

        } catch (err) {
            next(err)
        }

    });

    app.get('/api/v1/product/category/:type', async (req, res, next) => {

        const type = req.params.type;
        try {
            const { data } = await productService.getProductsByCategory(type)
            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }

    });

    app.get('/api/v1/product/:productId', async (req, res, next) => {

        const productId = req.params.productId;

        try {
            const { data } = await productService.getProductById(productId);
            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }

    });

    app.post('/api/v1/product/ids', async (req, res, next) => {

        try {
            const { ids } = req.body;
            const products = await productService.getSelectedProducts(ids);
            return res.status(200).json(products);

        } catch (err) {
            next(err)
        }

    });


}

export { products }