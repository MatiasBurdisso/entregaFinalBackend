import { Router } from "express";
import DBManager from "../data/DBManager.js";
const cartsRouter = Router();

const CartsManager = new DBManager.CartsManager();

//Este método devolverá los carros y, si se proporciona, los filtrará con un límite.
cartsRouter.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    res.send(await CartsManager.getCarts(limit));
  } catch (err) {
    res.status(500).send(err.message);
    const error = err.message;
    console.log(error);
  }
});

//Este método devolverá el carrito con el id correspondiente.
cartsRouter.get("/:cid", async (req, res) => {
  try {
    const id = req.params.cid;
    res.send(await CartsManager.getCartById(id));
  } catch (err) {
    res.status(500).send("Cart not found");
    const error = err.message;
    console.log(error);
  }
});

//Este método agregará un carrito a la colección.
cartsRouter.post("/", async (req, res) => {
  try {
    const arr = req.body;
    const cart = await CartsManager.addCart(arr);
    res.send({ message: "Cart successfully added", cart });
  } catch (err) {
    res.status(500).send(err.message);
    const error = err.message;
    console.log(error);
  }
});

//Este método agrega un producto al carrito encontrado por su id. Si ya existe solo suma 1 a su cantidad, de lo contrario lo creará con una cantidad inicial de 1 unidad.
cartsRouter.post("/:cid/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const result = await CartsManager.updateCartProducts(cid, pid);
    res.send({
      message: "Products in cart successfully updated",
      acknowledged: result.acknowledged,
    });
  } catch (err) {
    res.status(500).send("Cart not found");
    const error = err.message;
    console.log(error);
  }
});

//Este método eliminará un carrito.
cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const id = req.params.cid;
    const result = await CartsManager.deleteCart(id);
    res
      .status(200)
      .send({ message: "Cart deleted", acknowledged: result.acknowledged });
  } catch (err) {
    res.status(500).send(err.message);
    const error = err.message;
    console.log(error);
  }
});

//Este método eliminará un producto dentro de un carrito.
cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const id = req.params.cid;
    const pid = req.params.pid;
    const result = await CartsManager.deleteCartProduct(id, pid);
    res
      .status(200)
      .send({ message: "Product deleted", acknowledged: result.acknowledged });
  } catch (err) {
    res.status(500).send("Product not found");
    const error = err.message;
    console.log(error);
  }
});

//Este método actualizará la lista completa de productos en un carrito.
cartsRouter.put("/:cid", async (req, res) => {
  try {
    const id = req.params.cid;
    const products = req.body;
    const result = await CartsManager.updateCart(id, products);
    res.status(200).send({
      message: "Cart products updated",
      acknowledged: result.acknowledged,
    });
  } catch (err) {
    res.status(500).send(err.message);
    const error = err.message;
    console.log(error);
  }
});

//Este método actualizará la cantidad de un producto específico dentro de un carrito específico.
cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const id = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body;
    const result = await CartsManager.updateProductQuantity(id, pid, quantity);
    res.status(200).send({
      message: "Product quantity updated",
      acknowledged: result.acknowledged,
    });
  } catch (err) {
    res.status(500).send("Product not found");
    const error = err.message;
    console.log(error);
  }
});

//Este método eliminará todos los productos en un carrito.
cartsRouter.delete("/:cid/products", async (req, res) => {
  try {
    const id = req.params.cid;
    const result = await CartsManager.deleteCartProducts(id);
    res
      .status(200)
      .send({ message: "Products deleted", acknowledged: result.acknowledged });
  } catch (err) {
    res.status(500).send(err.message);
    const error = err.message;
    console.log(error);
  }
});

//Exportando el enrutador.
export default cartsRouter;