import { Router, json } from "express";
import { CartsManager } from "../dao/index.js";

const cartsRouter  = Router ();
const cartManager = new CartsManager();



cartsRouter.get("/", async (req, res) => {
    const carts = await cartManager.getAll();
    res.send(carts);
});

cartsRouter.post("/", async (req, res) => {
    const {title, description, vendedor } = req.body;

    
    if(!title || !description || !vendedor ) {
        return res
            .status(400)
            .send({ status: "error", payload: "Missing parameters" });
    }

    const result = await cartManager.create({
        title,
        description,
        vendedor,
        products: [],
    });

    res.status(201).send({ status: "ok", payload: result});
});


cartsRouter.post("/:cartId/:productId", async (req, res) => {
    const { cartId, productId } = req.params;

    const result = await cartManager.addProduct(cartId, productId);

    res.send({ status: "ok", payload: result});
});

cartsRouter.delete("/:cartId", async (req, res) => {
    const { cartId } = req.params;

    const result = await cartManager.deleteProducts(cartId);

    res.send({ status: "ok", payload: result});
});

cartsRouter.put("/:cartId", async (req, res) =>{
    const { cartId, productId } = req.params;

    const result = await cartManager.updatedProducts(cartId, productId);

    res.send({ status: "ok", payload: result});
});

cartsRouter.delete("/:cartId/products/:productId", async (req, res) =>{
    const { cartId, productId } = req.params;

    const result = await cartManager.deleteProduct(cartId, productId);

    res.send({ status: "ok", payload: result});
});

cartsRouter.put("/:cartId/products/:productId", async (req, res) =>{
    const { cartId, productId } = req.body;

    const result = await cartManager.updatedProduct(cartId, productId);

    res.send({ status: "ok", payload: result});
});



export default cartsRouter