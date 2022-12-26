import { mongoose } from 'mongoose';
import { DB_URL } from '../config/index.js';

export const databaseConnection = async () => {

    try {
        await mongoose.set("strictQuery", false);
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Db Connected');

    } catch (error) {
        console.log('Error ============')
        console.log(error);
        process.exit(1);
    }

};
