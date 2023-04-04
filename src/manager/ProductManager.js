import fs from "fs";


class ProductManager{
    #path;
    #nextId;
    constructor(path) {
        this.#path = path;
    }

async addProducts (title, description, price, thumbnail, code,  stock, category) {
    const products = await this.getProducts();

    const existingProduct = products.find((p) => p.code === code);
        if(existingProduct) {
            throw new Error (`Poduct with code ${code} already exists`);
        }

    const newProduct = {
        id: this.#nextId,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
    }
    
    const updatedProducts = [...products, newProduct];

    await fs.promises.writeFile(this.#path, JSON.stringify(updatedProducts));
    
    this.#nextId++;

    if(!title || !code || !description) {
        throw new Error ("Not Found / No encontrado");
    }

    const productWithSameCodeExists = products.some(
        (p) =>p.code === code);

        if(productWithSameCodeExists){
            throw new Error ("This product already exists / Este producto ya existe");
        }

    
};


async getProducts() {
    try {
        const products =  await fs.promises.readFile(this.#path, "utf-8");

        return JSON.parse(products)
    } catch (e) {
        return [];
    }
}
async getProductById(code) {
    const products = await getProducts();
    const product = await products.find((prod) => prod.code === code);

    if (!product) {
        throw new Error(`Product with id ${code} not found`);
    }
    return product;
    }
async deleteProducts(code){
    const products = await this.getProducts();

    const updatedProducts = products.filter((p) => {
        return p.code !== code;
    });

    await fs.promises.writeFile(this.#path, JSON.stringify(updatedProducts))
    console.log("Producto eliminado con exito");
}


};



export default ProductManager