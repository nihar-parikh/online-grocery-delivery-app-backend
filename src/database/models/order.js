import { Schema as _Schema, model } from 'mongoose';

const Schema = _Schema;

const OrderSchema = new Schema({
    orderId: String,
    customerId: String,
    amount: Number,
    status: String,
    txnId: String,
    items: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'product', required: true },
            unit: { type: Number, require: true }
        }
    ]
},
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
            }
        },
        timestamps: true
    });

const orderModel = model('order', OrderSchema);

export { orderModel }