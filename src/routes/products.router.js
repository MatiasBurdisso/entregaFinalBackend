import { Router, json } from "express";
import { ProductsManager } from "../dao/index.js";

let products = [];

const productsRouter  = Router ();
productsRouter.use(json());
const productsManager = new ProductsManager();


productsRouter.get("/", async(req, res) => {
    const products = await productsManager.getAll();

    res.send(products);
});

productsRouter.get("/:pid", async (req, res)=>{

    try{
        const {pid} = req.params
        const product = await productsManager.getProductById(parseInt(pid))
        res.send(product)
    } catch(err) {
        res.status(404).send(`${err}`)
    }
});

productsRouter.post("/", async (req, res) => {
    const {title, description, price, stock } = req.body;

    if(!title || !description || !price || !stock) {
        return res.status(400).send({ status:"error", payload: "Missing patameters"});
    }

    const result = await productsManager.create({
        title,
        description,
        price,
        stock,
    });

    res.status(201).send({ status: "ok", payload: result});
});


productsRouter.put("/products/:pid", async (req, res) =>{
    try{
        const {pid} = req.params
        const id = parseInt(pid)
        await manager.updatedProducts(id, req.body)

        const products = await productsManager.getProducts()
        req.io.emit("update-product", products)
    
        res.send({status: "succes", payload: await productsManager.getProductById(id)})
    }catch(err){
        res.status(404).send({status: "error", error: `${err}`})
    }
});

productsRouter.delete("/:pid", async(req, res)=>{
    try{
        const {pid} = req.params
        const id = parseInt(pid)
        await productsManager.deleteProducts(id, req.body)

        const products = await productsManager.getProducts()
        req.io.emit("delete-product", products)

        res.send({status: "succes", payload: "Producto eliminado"})
    } catch(err){
        res.status(404).send({status: "error", error: `${err}`})
    }
});


export default productsRouter;