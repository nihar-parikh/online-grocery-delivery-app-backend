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
                .populate({
                    path: 'address',
                    select: 'country',
                })
                .populate([{
                    path: 'wishlist',
                    select: 'name',
                }])
                .populate([{
                    path: 'orders',
                    populate: [{
                        path: 'items',
                        populate: [
                            {
                                path: 'product',
                                // select: 'name'
                            },
                        ],
                    },],
                }])
                .populate([{
                    path: 'cart',
                    populate: [
                        {
                            path: 'product',
                            // select: 'name'
                        },
                    ],
                }]);
            return existingCustomer;
        } catch (err) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Customer');
        }
    }

    async addWishlistItem(customerId, product) {
        try {
            const profile = await customerModel.findById(customerId);
            if (profile) {

                let wishlist = profile.wishlist;
                if (wishlist.length > 0) {
                    let isExist = false;
                    wishlist.map(item => {
                        //--if item already exist in wishlist then remove it when this endpoint hits for second time->toggle--//
                        if (item.toString() === product.data._id.toString()) {
                            const index = wishlist.indexOf(item);
                            wishlist.splice(index, 1);
                            isExist = true;
                        }
                    });

                    if (isExist === false) {
                        wishlist.push(product.data);
                    }

                }
                else {
                    wishlist.push(product.data);
                }
                profile.wishlist = wishlist;
            }

            await profile.save();
            const profileResult = await customerModel.findById(customerId).populate("wishlist")
            return profileResult.wishlist;

        } catch (err) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Add to WishList')
        }

    }

    async wishlist(customerId) {
        try {
            const profile = await customerModel.findById(customerId).populate("wishlist")
            return profile.wishlist;
        } catch (err) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Get Wishlist ')
        }
    }

    async addCartItem(customerId, product, quantity, isRemove) {
        try {
            const profile = await customerModel.findById(customerId).populate(
                "cart.product"
            );

            if (profile) {
                const cartItem = {
                    product,
                    unit: quantity,
                };

                let cartItems = profile.cart;

                if (cartItems.length > 0) {
                    let isExist = false;
                    cartItems.map((item) => {
                        if (item.product._id.toString() === product._id.toString()) {
                            if (isRemove) {
                                cartItems.splice(cartItems.indexOf(item), 1);
                            } else {
                                item.unit = quantity;
                            }
                            isExist = true;
                        }
                    });

                    if (!isExist) {
                        cartItems.push(cartItem);
                    }
                } else {
                    cartItems.push(cartItem);
                }

                profile.cart = cartItems;

                const cartSaveResult = await profile.save();

                return cartSaveResult.cart;
            }

            throw new Error("Unable to add to cart!");
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Create Customer"
            );
        }
    }

    async filterAllCustomers({ tableName, query }) {
        const checkModelName = (tableName) => {
            if (tableName === "customers") {
                return customerModel
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
                "Unable to Get Customers"
            );
        }
    }
}

export { CustomerRepository };