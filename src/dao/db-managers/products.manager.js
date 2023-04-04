import productsModel from "../models/products.model.js";

export default class ProductsManager{
    constructor(){
        console.log("Working with products using database");
    }

    getAll = async () => {
        const products = await productsModel.find().lean();

        return products;
    };

    create = async (products) => {
        const result = await productsModel.create(products);

        return result;
    };
}