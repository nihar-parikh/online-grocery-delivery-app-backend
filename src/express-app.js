import { json, urlencoded } from 'express';
import cors from 'cors';
import { customer } from './api/index.js';
import { ErrorHandler } from './utils/error-handler.js';

const expressApp = async (app) => {

    app.use(json({ limit: '1mb' }));
    app.use(urlencoded({ extended: true, limit: '1mb' }));
    app.use(cors());

    //api
    customer(app);

    // error handling
    app.use(ErrorHandler);
}

export { expressApp }