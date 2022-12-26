import { Schema as _Schema, model } from 'mongoose';

const Schema = _Schema;

const CustomerSchema = new Schema({
    email: String,
    password: String,
    salt: String,
    phone: String,
    address: [
        { type: Schema.Types.ObjectId, ref: 'address', require: true }
    ],
    cart: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'product', require: true },
            unit: { type: Number, require: true }
        }
    ],
    wishlist: [
        {
            type: Schema.Types.ObjectId, ref: 'product', require: true
        }
    ],
    orders: [
        { type: Schema.Types.ObjectId, ref: 'order', require: true }
    ]
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
        }
    },
    timestamps: true
});

const customerModel = model('customer', CustomerSchema);

export { customerModel }