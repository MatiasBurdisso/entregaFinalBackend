import { cartModel } from "../models/cart.js";
import { productModel } from "../models/product.js";

const cartsModel = cartModel;
const productsModel = productModel;

class CartsManager {
  // Esta función devuelve todos los carros presentes en la colección. En caso de que haya un límite establecido con un parámetro de consulta, limita los datos que se envían.
  getCarts(a) {
    if (a === undefined) {
      return cartsModel.find();
    }
    return cartsModel.find().limit(a);
  }

  //Esta función trae los carros presentes en la colección por id.
  getCartById(id) {
    return cartsModel.find({ _id: id });
  }

  //Esta función agregará un carrito a la colección.
  addCart(arr) {
    return cartsModel.create(arr);
  }

  //Esta función actualiza los productos presentes en un carrito (encontrado por id).
  // En caso de que el producto ya exista solo agrega 1 unidad, si no lo agrega con una cantidad de 1.
  async updateCartProducts(cid, pid) {
    let ind;
    const cart = await cartsModel.find({ _id: cid });
    const newProd = { product: pid, quantity: 1 };
    const Nproducts = cart[0].products;

    Nproducts.forEach((element, index) => {
      if (pid === element.product._id.toJSON()) {
        ind = index;
      }
    });

    if (!isNaN(ind)) {
      Nproducts[ind].quantity++;
    } else {
      Nproducts.push(newProd);
    }

    const result = cartsModel
      .find({ _id: cid })
      .updateMany({ products: Nproducts });
    return result;
  }

  //Esta función elimina un carrito de la colección.
  deleteCart(id) {
    return cartsModel.deleteOne({ _id: id });
  }

  //Esta función elimina un producto dado en un carrito ya existente.
  async deleteCartProduct(cid, pid) {
    let ind;
    const cart = await cartsModel.find({ _id: cid });
    const Nproducts = cart[0].products;
    Nproducts.forEach((element, index) => {
      if (pid === element.product._id.toJSON()) {
        ind = index;
      }
    });

    if (!isNaN(ind)) {
      Nproducts.splice(ind, 1);
      const result = cartsModel
        .find({ _id: cid })
        .updateMany({ products: Nproducts });
      return result;
    }
  }

  //Esta función le permite actualizar todo el carrito.
  updateCart(cid, products) {
    const result = cartsModel
      .find({ _id: cid })
      .updateMany({ products: products });
    return result;
  }

  //Esta función actualiza la cantidad de un producto ya existente.
  async updateProductQuantity(cid, pid, qty) {
    let ind;
    const cart = await cartsModel.find({ _id: cid });
    const Nproducts = cart[0].products;
    Nproducts.forEach((element, index) => {
      if (pid === element.product._id.toJSON()) {
        ind = index;
      }
    });

    if (!isNaN(ind)) {
      Nproducts[ind].quantity = qty.quantity;
      const result = cartsModel
        .find({ _id: cid })
        .updateMany({ products: Nproducts });
      return result;
    }
  }

  //Esta función elimina los productos de un carrito..
  deleteCartProducts(cid) {
    const result = cartsModel.find({ _id: cid }).updateMany({ products: [] });
    return result;
  }
}

class ProductsManager {
  //Esta función trae todos los productos presentes en la colección. En caso de que haya un límite establecido con un parámetro de consulta, limita los datos que se envían.
  getProducts(a) {
    if (a === undefined) {
      return productsModel.find();
    }
    return productsModel.find().limit(a);
  }

  //Esta función se encarga de encontrar todos los productos presentes en la colección. Utiliza la paginación para servir el producto según sea necesario.
  //Lo que significa que la solicitud se puede filtrar por categoría o stock, y también puede tener un límite y opciones de clasificación. Todo ello incluyendo las opciones para navegar por la paginación.
  getProductsPag(category, stock, page, limit, sort, url) {
    let query;
    let prevURL;
    let nextURL;
    console.log(url);
    if (sort === "asc") {
      sort = 1;
    } else if (sort === "desc") {
      sort = -1;
    }

    if (category != undefined || stock != undefined) {
      if (category != undefined) {
        query = { category: category };
      } else {
        query = { stock: stock };
      }
    } else {
      query = {};
    }

    return productsModel.paginate(
      query,
      {
        page: page,
        limit: limit,
        sort: { price: sort },
      },
      (err, res) => {
        res.hasPrevPage
          ? (prevURL = url.replace(`page=${res.page}`, `page=${res.prevPage}`))
          : null;
        res.hasNextPage
          ? (nextURL = url.replace(`page=${res.page}`, `page=${res.nextPage}`))
          : null;
        return {
          status: res.docs.length != 0 ? "success" : "error",
          payload: res.docs,
          totalPages: res.totalPages,
          prevPage: res.prevPage,
          nextPage: res.nextPage,
          page: res.page,
          hasPrevPage: res.hasPrevPage,
          hasNextPage: res.hasNextPage,
          prevLink: prevURL,
          nextLink: nextURL,
        };
      }
    );
  }

  //Esta función trae los productos presentes en la colección por id.
  getProductById(id) {
    return productsModel.find({ _id: id });
  }

  

  //Esta función agrega un producto a la colección.
  addProducts(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail
  ) {
    const product = {
      title: title,
      description: description,
      code: code,
      price: price,
      status: status,
      stock: stock,
      category: category,
      thumbnail: thumbnail,
    };
    productsModel.create(product);
  }

  //Esta función actualiza los datos de un producto.
  updateProduct(id, product) {
    
    return productsModel.find({ _id: id }).updateMany(product);
  }

  //Esta función elimina un producto de la colección.
  deleteProduct(id) {
    return productsModel.deleteOne({ _id: id });
  }
}

// Exportando objetos.
export default { CartsManager };