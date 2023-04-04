import fs from "fs";
import __dirname from "../../utils.js";
import { getNextId } from "./utils.js";


const path = __dirname + "/dao/file-managers/files/carts.json";
// esa ruta hace que cuando creo un usuario en postman, me creo en files el archivo {}users.json donde me guarda el usuario que cree

export default class CartManager {
    constructor() {
        
        console.log("working with carts using filesystem");
    }

        // getAll le todos los archivos JSON donde vamos a guardarlo
    getAll = async() => {
        if (fs.existsSync(path)) {
            const data = await fs.promises.readFile(path, "utf-8");

            return JSON.parse(data);

        }
        
        return [];
        
    };

    create = async (cart) => {
        const carts = await this.getAll();

        const newCart = {
            ...cart,
            id: getNextId(carts),
        };

        const updatedCarts = [...carts, newCart]

        await fs.promises.writeFile(path, JSON.stringify(updatedCarts));

        return newCart
    };
}