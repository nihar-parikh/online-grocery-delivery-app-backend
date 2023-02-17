import { CustomerRepository } from "../database/index.js";
import { APIError, BadRequestError } from '../utils/app-errors.js'
import { formatData } from "../utils/index.js";
import { generatePassword, generateSalt, generateToken, validatePassword } from "../utils/passwordUtils.js";


// All Business logic will be here
class CustomerService {

    constructor() {
        this.repository = new CustomerRepository();
    }

    async signUp(userInputs) {

        const { email, password, phone } = userInputs;

        try {
            // create salt
            let salt = await generateSalt();

            let userPassword = await generatePassword(password, salt);

            const existingCustomer = await this.repository.createCustomer({ email, password: userPassword, phone, salt });

            const token = await generateToken({ email: email, _id: existingCustomer._id });

            return formatData({ id: existingCustomer._id, token });

        } catch (err) {
            throw new APIError('Data Not found', 404, err)
        }

    }

    async logIn(userInputs) {

        const { email, password } = userInputs;

        try {

            const existingCustomer = await this.repository.findCustomer({ email });

            if (existingCustomer) {

                const validPassword = await validatePassword(password, existingCustomer.password, existingCustomer.salt);

                if (validPassword) {
                    const token = await generateToken({ email: existingCustomer.email, _id: existingCustomer._id });
                    return formatData({ id: existingCustomer._id, token });
                }
            }

            return formatData(null);

        } catch (err) {
            throw new APIError('Data Not found', 404, err)
        }


    }

    async addNewAddress(_id, userInputs) {

        const { street, postalCode, city, country } = userInputs;

        try {
            const addressResult = await this.repository.createAddress({ _id, street, postalCode, city, country })
            return formatData(addressResult);

        } catch (err) {
            throw new APIError('Data Not found', err)
        }


    }

    async getProfile(id) {

        try {
            const existingCustomer = await this.repository.findCustomerById({ id });
            return formatData(existingCustomer);

        } catch (err) {
            throw new APIError('Data Not found', err)
        }
    }

    async addToWishlist(customerId, product) {
        try {
            const wishlistResult = await this.repository.addWishlistItem(customerId, product);
            return formatData(wishlistResult);

        } catch (err) {
            throw new APIError('Data Not found', err)
        }
    }

    async getWishList(customerId) {

        try {
            const wishListItems = await this.repository.wishlist(customerId);
            return formatData(wishListItems);
        } catch (err) {
            throw new APIError('Data Not found', err)
        }
    }

    async manageCart({ customerId, product, quantity, isRemove }) {
        try {
            const cartResult = await this.repository.addCartItem(customerId, product, quantity, isRemove);
            return formatData(cartResult);
        } catch (error) {
            throw new APIError('Data Not found', error)
        }
    }

    async getShopingDetails(id) {

        try {
            const existingCustomer = await this.repository.findCustomerById({ id });

            if (existingCustomer) {
                return formatData(existingCustomer);
            }
            return formatData({ msg: 'Error' });

        } catch (err) {
            throw new APIError('Data Not found', err)
        }
    }
}

export { CustomerService }