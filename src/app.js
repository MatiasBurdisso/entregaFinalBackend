import express from "express";
import ProductManager from "./manager/ProductManager.js";
import productsRouter from "./routes/products.router.js";
import CartManager from "./manager/CartManager.js";
import cartsRouter from "./routes/carts.router.js";
import __dirname from "./utils.js";
import { engine }  from "express-handlebars"
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import productsModel from "./dao/models/products.model.js";
import cartModel from "./dao/models/carts.model.js";


const app = express();
app.use(express.json());
const messages = [];

const manager = new ProductManager(__dirname + "/Products.json");
const cartManager = new CartManager(__dirname + "/Carts.json");

app.use(express.static(__dirname + "/../public"));

// Handlebars
app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Router
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);



// Mongoose
const main = async () => { 
await mongoose
    .connect("mongodb+srv://rodrigovildoza:revp3242@rodrivp.xpq0vwj.mongodb.net/desafio?retryWrites=true&w=majority")
    .then((conn) => {
        console.log("Conected to MongoDB!!");
});

const products = await productsModel.aggregate([
    { $group: { _id: "$title", Precio: { $sum: "$price"} }  },
    { $sort: {Precio: -1} },
    { $group: { _id: 1, products: { $push: "$$ROOT"} } },
    {
        $project: {
            _id: 0,
            Pizzas: "$products",
        },
    },
    { $merge: { into: "reports" } },
]);



const cart = await cartModel.findById("6420aed66e7b33491341d6b6")
console.log(JSON.stringify(cart, null, "\t"));


};

main();

const httpServer = app.listen(8080, () => {
    console.log("Server listening on port 8080");
});

const io = new Server(httpServer);

io.on("connection", (socket) => {
    socket.on("chat-message", (data) => {
        messages.push(data);

        io.emit("messages", messages);
        // recibe todos ls msjs actualizados a todos los clientes.
    })


console.log("Nuevo cliente conectado!");
// mensaje en terminal
    
socket.emit("messege", "Mensage de parte de Somos Pacifica!!!");
// mensaje en consola

socket.on("messege", (data) =>{
        console.log(data);});

app.use((req,res,next)=>{
    req.io = io
    next()
});

        
});

export { manager, cartManager }