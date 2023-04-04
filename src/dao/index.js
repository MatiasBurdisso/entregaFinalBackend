import FileProductsManager from "./file-managers/products.manager.js";
import DbProductsManager from "./db-managers/products.manager.js";
import FileCartsManager from "./file-managers/carts.manager.js";
import DbCartsManager from "./db-managers/carts.manager.js";
import DbMessageManager from "./db-managers/messages.manager.js"
// importamos los 4 manager que tenemos

const config = {
    persistenceType: "db",
};
// "db" o "file" es segun cual usemos de las dos variables, se exporta el que usemos, 

let ProductsManager, CartsManager, MessageManager;

if (config.persistenceType ==="db") {
    ProductsManager = DbProductsManager;
    CartsManager = DbCartsManager;
    MessageManager = DbMessageManager;
} else if (config.persistenceType === "file") {
    ProductsManager = FileProductsManager;
    CartsManager = FileCartsManager;
} else {
    throw new Error("Unknow persistence type");
}

export { ProductsManager, CartsManager, MessageManager };