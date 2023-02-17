import { ShoppingRepository } from "../database/index.js";
import { APIError, BadRequestError } from '../utils/app-errors.js'
import { formatData } from "../utils/index.js";

// All Business logic will be here
class ShoppingService {

    constructor() {
        this.repository = new ShoppingRepository();
    }


    async placeOrder(userInput) {
        const { _id, txnNumber } = userInput;

        // Verify the txn number with payment logs

        try {
            const orderResult = await this.repository.createNewOrder(_id, txnNumber);
            return formatData(orderResult);
        } catch (err) {
            throw new APIError("Data Not found", err);
        }
    }

    async GetOrders(customerId) {
        try {
            const orders = await this.repository.Orders(customerId);
            return formatData(orders);
        } catch (err) {
            throw new APIError("Data Not found", err);
        }
    }
}

export { ShoppingService }
