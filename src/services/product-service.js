import { APIError } from "../utils/app-errors.js";
import { ProductRepository } from "../database/index.js"
import { formatData } from "../utils/index.js";

// All Business logic will be here
class ProductService {

    constructor() {
        this.repository = new ProductRepository();
    }

    async createProduct(productInputs) {
        try {
            const productResult = await this.repository.createProduct(productInputs)
            return formatData(productResult);
        } catch (err) {
            throw new APIError('Data Not found')
        }
    }

    async GetProducts() {
        try {
            const products = await this.repository.Products();

            let categories = {};

            products.map(({ type }) => {
                categories[type] = type;
            });

            return FormateData({
                products,
                categories: Object.keys(categories),
            })

        } catch (err) {
            throw new APIError('Data Not found')
        }
    }


    async getProductById(productId) {
        try {
            const product = await this.repository.findById(productId);
            return formatData(product)
        } catch (err) {
            throw new APIError('Data Not found')
        }
    }

    async getAllProducts({ tableName, query }) {
        try {
            const products = await this.repository.filterAllProducts({ tableName, query });
            return formatData(products)
        } catch (err) {
            throw new APIError('Data Not found')
        }
    }


    async getProductsByCategory(category) {
        try {
            const products = await this.repository.findByCategory(category);
            return formatData(products)
        } catch (err) {
            throw new APIError('Data Not found')
        }

    }

    async getSelectedProducts(selectedIds) {
        try {
            const products = await this.repository.findSelectedProducts(selectedIds);
            return formatData(products);
        } catch (err) {
            throw new APIError('Data Not found')
        }
    }

    async GetProductById(productId) {
        try {
            return await this.repository.FindById(productId);
        } catch (err) {
            throw new APIError('Data Not found')
        }
    }

}

export { ProductService }