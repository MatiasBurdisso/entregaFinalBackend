import cartsModel from "../models/carts.model.js";

export default class CartsManager{
    constructor(){
        console.log("Working with carts using database");
    }

    
    getAll = async () => {
        const carts = await cartsModel.find().lean();

        return carts;
    };

    create = async (cart) => {
        const result = await cartsModel.create(cart);

        return result;
    };

        // carrito (esto retorna un objeto de mongoose)
    addProduct = async (cartId, productId) => {
        const cart = await cartsModel.findById(cartId);

        cart.products.push({ productId });
        return cart.save();
    };

    updatedProduct = async (cartId, productId) => {
        const updatedCart = await cart.findByIdAndUpdate(
            cartId,
            { $set: { "products.$[product].quantity": quantity } },
            
            { new: true, arrayFilters: [{ "product._id": productId }] }
            ); return updatedCart };

    deleteProducts = async (cartId) => {
        const cart = await cartsModel.findById(cartId);

        cart.products.remove({ cartId});
        return cart.save();
    };
    
};

