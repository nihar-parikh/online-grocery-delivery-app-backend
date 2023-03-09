import { productModel } from "../models/product.js";
import {
    APIError,
    BadRequestError,
    STATUS_CODES,
} from "../../utils/app-errors.js";

//Dealing with data base operations
class ProductRepository {
    async createProduct({
        name,
        description,
        type,
        unit,
        price,
        available,
        suplier,
        banner,
    }) {
        try {
            const product = new productModel({
                name,
                description,
                type,
                unit,
                price,
                available,
                suplier,
                banner,
            });

            const productResult = await product.save();
            return productResult;
        } catch (err) {
            throw APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Create Product"
            );
        }
    }

    async Products() {
        try {
            return await productModel.find();
        } catch (err) {
            throw APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Get Products"
            );
        }
    }

    async filterAllProducts({ tableName, query }) {
        const checkModelName = (tableName) => {
            if (tableName === "products") {
                return productModel
            }
        }
        try {
            return await checkModelName(tableName).aggregate([
                {
                    $match: query
                },
            ]);
        } catch (err) {
            throw APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Get Products"
            );
        }
    }

    async findById(id) {
        try {
            return await productModel.findById(id);
        } catch (err) {
            throw APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Find Product"
            );
        }
    }

    async findByCategory(category) {
        try {
            const products = await productModel.find({ type: category });
            return products;
        } catch (err) {
            throw APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Find Category"
            );
        }
    }

    async findSelectedProducts(selectedIds) {
        try {
            const products = await productModel
                .find()
                .where("_id")
                .in(selectedIds.map((_id) => _id))
                .exec();
            return products;
        } catch (err) {
            throw APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Find Product"
            );
        }
    }
}

export { ProductRepository };
