import { cartModel } from "../models/cart.js";
import { productModel } from "../models/product.js";

const cartsModel = cartModel;
const productsModel = productModel;

class CartsManager {
  // This function returns all the carts present in the collection. In case there is a limit set with a query param it limits the data being sent.
  getCarts(a) {
    if (a === undefined) {
      return cartsModel.find();
    }
    return cartsModel.find().limit(a);
  }

  //This function brings the carts present in the collection by id.
  getCartById(id) {
    return cartsModel.find({ _id: id });
  }

  //This function will add a cart to the collection.
  addCart(arr) {
    return cartsModel.create(arr);
  }

  //This functions updates the products present in a cart (found by id).
  // In case the product already exists it only adds 1 unit, if not it adds it with a quantity of 1.
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

  //This function delete a cart from the collection.
  deleteCart(id) {
    return cartsModel.deleteOne({ _id: id });
  }

  //This function deletes a given product in a already existing cart.
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

  //This function allows you to update the whole cart.
  updateCart(cid, products) {
    const result = cartsModel
      .find({ _id: cid })
      .updateMany({ products: products });
    return result;
  }

  //This function updates the quantity of an already existing product.
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

  //This function deletes the products from a cart.
  deleteCartProducts(cid) {
    const result = cartsModel.find({ _id: cid }).updateMany({ products: [] });
    return result;
  }
}

class ProductsManager {
  //This function brings all the products present in the collection. In case there is a limit set with a query param it limits the data being sent.
  getProducts(a) {
    if (a === undefined) {
      return productsModel.find();
    }
    return productsModel.find().limit(a);
  }

  //This function is in charge of findig all of the products present in the collection. It uses pagination to serve the product as needed.
  //Meaning the request can be filtered by category or stock, and may also have a limit and sort options. All of this including the options to navigate through the pagination.
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

  //This function brings the products present in the collection by id.
  getProductById(id) {
    return productsModel.find({ _id: id });
  }

  // // Use  only in case the try catch in the route is deleted. Do not use throw as it will stop execution in the server
  // //   async getProductById(id) {
  // //     try {
  // //         return await productsModel.find({ _id: id });
  // //     } catch (error) {
  //         return error
  //         console.log(error.name);
  // //     }

  //   }

  //This function add a product to the collection.
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

  //This function updates the data of a product.
  updateProduct(id, product) {
    // const result =  await productsModel.findByIdAndUpdate(id,product)
    return productsModel.find({ _id: id }).updateMany(product);
  }

  //This function deletes a product from the collection.
  deleteProduct(id) {
    return productsModel.deleteOne({ _id: id });
  }
}

// Exporting objects.
export default { CartsManager };