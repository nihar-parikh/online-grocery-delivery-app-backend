import { customerModel, addressModel } from '../models/index.js';
import { APIError, BadRequestError, STATUS_CODES } from '../../utils/app-errors.js';

//Dealing with data base operations
class CustomerRepository {

    async createCustomer({ email, password, phone, salt }) {
        try {
            const customer = new customerModel({
                email,
                password,
                salt,
                phone,
                address: []
            })
            const customerResult = await customer.save();

            return customerResult;
        } catch (err) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Customer')
        }
    }

    async createAddress({ _id, street, postalCode, city, country }) {

        try {
            const profile = await customerModel.findById(_id);

            if (profile) {

                const newAddress = new addressModel({
                    street,
                    postalCode,
                    city,
                    country
                })

                await newAddress.save();

                profile.address.push(newAddress);
            }

            return await profile.save();

        } catch (err) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Error on Create Address')
        }
    }

    async findCustomer({ email }) {
        try {
            const existingCustomer = await customerModel.findOne({ email: email });
            return existingCustomer;
        } catch (err) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Customer')
        }
    }

    async findCustomerById({ id }) {

        try {
            const existingCustomer = await customerModel.findById(id)
                .populate('address')
            // .populate('wishlist')
            // .populate('orders')
            // .populate('cart.product');
            return existingCustomer;
        } catch (err) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Customer');
        }
    }

}

export { CustomerRepository };