import express from "express";
import mongoose from "mongoose";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import viewRoutes from "./routes/views.routes.js";
import { engine } from "express-handlebars";


const app = express();
const httpServer = app.listen(3000, () => {
    console.log("Server listening on port 3000");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/views", viewRoutes);

app.set("view engine", "ejs");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");



mongoose
    .connect("mongodb+srv://burdio:7654321@cluster0.pzcooec.mongodb.net/products?retryWrites=true&w=majority")
    .then((conn) => {
        console.log("Conected to MongoDB!!");
});





