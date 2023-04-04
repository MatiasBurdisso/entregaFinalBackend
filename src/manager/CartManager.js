import fs from "fs" 

class CartManager {
    #nextId = 0;
    #path = ""

    constructor(path){
        this.#path = "./carts.json";
    }

    async getCarts(){
        try{
            const carts = await fs.promises.readFile(this.#path, "utf-8")
            return JSON.parse(carts)
        }catch(err){
            return []
        }
    }

    async getIDs(){
        let carts = await this.getCarts()
        const ids = carts.map(c => c.id)
        let mayorID = Math.max(...ids)
        if (mayorID === -Infinity) {
            return 0
        } else {
            return ++mayorID
        }
    }

    async addCart(){
        const carts = await this.getCarts();

        const newCart = {
            id: this.#nextId,
            products: [],
        };

        const updatedCarts = [...carts, newCart];
        await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts));
        this.#nextId++;

        return newCart;
    }

    async getCartById(id){
        let carts = await this.getCarts()
        
        let cart = carts.find( c => c.id === id)
        
        return cart;
    }

    async addProductToCart(prod, cartID){
        try{
            let carts = await this.getCarts()
            let cart = await this.getCartProducts(cartID)

            //Verifico si el producto existe en el carrito
            let prodInCart = cart.products.find( p => p.id === prod.id)

            if (prodInCart){
                prodInCart.quantity += 1
                let filterProducts = cart.products.filter( p => p.id !== prodInCart.id) 
                filterProducts = [
                    ...filterProducts,
                    prodInCart
                ]
                cart.products = filterProducts
                let newCarts = carts.filter( c => c.id !== cartID)
                newCarts = [
                    ...newCarts,
                    cart
                ]
                await fs.promises.writeFile(this.#path, JSON.stringify(newCarts))
            } else {
                cart.products = [
                    ...cart.products,
                    {
                        id: prod.id,
                        quantity: 1
                    }
                ]
                let newCarts = carts.filter( c => c.id !== cartID)
                newCarts = [
                    ...newCarts,
                    cart
                ]
                await fs.promises.writeFile(this.#path, JSON.stringify(newCarts))
            }
            
        }catch(err){
            throw new Error(err)
        }
    }

    async deleteProductInCart(cartID, productID){
        try{
            let carts = await this.getCarts()
            let cart = await this.getCartProducts(cartID)

            let prodInCart = cart.products.find( p => p.id === productID)

            if(!prodInCart){
                throw new Error("No existe producto con ese ID en este carrito.")
            }

            if (prodInCart.quantity > 1){
                prodInCart.quantity -= 1
                let filterProducts = cart.products.filter( p => p.id !== prodInCart.id) 
                filterProducts = [
                    ...filterProducts,
                    prodInCart
                ]
                cart.products = filterProducts
                let newCarts = carts.filter( c => c.id !== cartID)
                newCarts = [
                    ...newCarts,
                    cart
                ]
                await fs.promises.writeFile(this.#path, JSON.stringify(newCarts))
            } else {
                let newCartProducts = cart.products.filter(p => p.id !== productID)
                cart.products = newCartProducts
                let newCarts = carts.filter( c => c.id !== cartID)
                newCarts = [
                    ...newCarts,
                    cart
                ]
                await fs.promises.writeFile(this.#path, JSON.stringify(newCarts))
            }

        }catch(err){
            throw new Error(err)
        }
    }
}

export default CartManager