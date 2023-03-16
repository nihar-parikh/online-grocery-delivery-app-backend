import { customerModel, addressModel, orderModel } from "../database/models/index.js";


export const checkModelName = (tableName) => {
    if (tableName === "customers") {
        return customerModel;
    }
};