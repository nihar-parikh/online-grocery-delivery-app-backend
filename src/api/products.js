import { ProductService } from '../services/product-service.js';
import { CustomerService } from '../services/customer-service.js';
import { userAuth } from './middileware/auth.js';
import CryptoJS from "crypto-js";

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

    app.post('/api/v1/product', async (req, res, next) => {
        const { tableName, query } = req.body;

        let key = CryptoJS.enc.Utf8.parse("0823202210301035");
        let iv = CryptoJS.enc.Utf8.parse("0823202210301035");

        // Methods for encrypt using AES256
        const encryptData = (object) => {
            let encrypted = CryptoJS.AES.encrypt(JSON.stringify(object), key, {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            })
            return encrypted.toString();
        }

        // Methods for decrypt using AES256
        const decryptData = (object) => {
            let decrypted = CryptoJS.AES.decrypt(object, key, {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            });

            return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
        }

        // console.log(encryptData(query))
        console.log(decryptData(query));
        try {
            const { data } = await productService.getAllProducts({ tableName, query: decryptData(query) });
            return res.status(200).json(encryptData(data));
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

    app.put('/api/v1/product/cart', userAuth, async (req, res, next) => {

        const { productId, quantity } = req.body;

        try {
            const { data } = await productService.getProductById(productId);

            const result = await customerService.manageCart({ customerId: req.user._id, product: data, quantity, isRemove: false });

            return res.status(200).json(result);

        } catch (err) {
            next(err)
        }
    });

    app.delete('/api/v1/product/cart/:productId', userAuth, async (req, res, next) => {

        const { productId } = req.params
        try {
            const { data } = await productService.getProductById(productId);

            const result = await customerService.manageCart({ customerId: req.user._id, product: data, quantity: 0, isRemove: true });
            return res.status(200).json(result);
        } catch (err) {
            next(err)
        }
    });

}

export { products }