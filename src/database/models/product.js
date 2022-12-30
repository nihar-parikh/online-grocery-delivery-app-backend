import { Schema as _Schema, model } from 'mongoose';

const Schema = _Schema;

const ProductSchema = new Schema({
    name: String,
    description: String,
    banner: String,
    type: String,
    unit: Number,
    price: Number,
    available: Boolean,
    suplier: String
});

const productModel = model('product', ProductSchema);

export { productModel }