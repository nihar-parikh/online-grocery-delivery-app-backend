// database related modules
import { databaseConnection } from './connection.js'
import { CustomerRepository } from './repository/customer-repository.js'
import { ProductRepository } from './repository/product-repository.js'
import { ShoppingRepository } from './repository/shopping-repository.js'

export {
    databaseConnection,
    CustomerRepository,
    ProductRepository,
    ShoppingRepository
}