import { CustomerService } from '../services/customer-service.js';
import { userAuth } from './middileware/auth.js';

const customer = (app) => {

    const service = new CustomerService();

    app.post('/api/v1/customer/signup', async (req, res, next) => {
        try {
            const { email, password, phone } = req.body;
            const { data } = await service.signUp({ email, password, phone });
            return res.json(data);

        } catch (err) {
            next(err)
        }

    });

    app.post('/api/v1/customer/login', async (req, res, next) => {

        try {

            const { email, password } = req.body;

            const { data } = await service.logIn({ email, password });

            return res.json(data);

        } catch (err) {
            next(err)
        }

    });

    app.post('/api/v1/customer/address', userAuth, async (req, res, next) => {

        try {

            const { _id } = req.user;

            const { street, postalCode, city, country } = req.body;

            const { data } = await service.addNewAddress(_id, { street, postalCode, city, country });

            return res.json(data);

        } catch (err) {
            next(err)
        }


    });

    app.get('/api/v1/customer/profile', userAuth, async (req, res, next) => {

        try {
            const { _id } = req.user;
            const { data } = await service.getProfile({ _id });
            return res.json(data);

        } catch (err) {
            next(err)
        }
    });

}

export { customer }