import { Router } from "express";
import { productModel } from "../models/product.js";

const router = Router();

router.get("/", async (req, res) => {
  const stock = req.query.stock;
  const page = req.query.page;
  const limit = req.query.limit || 10;
  const sort = req.query.sort || 1;
  let query;
  let prevURL;
  let nextURL;

  const url = req.protocol + "://" + req.get("host") + req.originalUrl;
  const category = req.query.category;
  if (category != undefined || stock != undefined) {
    if (category != undefined) {
      query = { category: category };
    } else {
      query = { stock: stock };
    }
  } else {
    if (category != undefined && stock != undefined) {
      query = { category: category, stock: stock };
    } else {
      query = {};
    }
  }
  try {
    const respuesta = await productModel.paginate(
      query,
      {
        page: page || 1,
        limit: limit,
        sort: { price: sort },
      },
      (err, res) => {
        res.hasPrevPage
          ? (prevURL = url.replace(`page=${res.page}`, `page=${res.prevPage}`))
          : null;
        res.hasNextPage
          ? (nextURL =
              page == undefined
                ? url.concat(`&page=${res.nextPage}`)
                : url.replace(`page=${res.page}`, `page=${res.nextPage}`))
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
    res.send(respuesta);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, artist, price, thumbnail, code, stock, status, category } =
      req.body;
    if (
      !title ||
      !artist ||
      !price ||
      !thumbnail ||
      !code ||
      !stock ||
      !status ||
      !category
    ) {
      res.status(400).send({ error: "Faltan datos" });
      return;
    }
    //const newProduct = new productModel({ title, artist, price, thumbnail, code, stock, status });
    // const respuesta = await newProduct.save();
    const respuesta = await productModel.create({
      title,
      artist,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    });
    res.send(respuesta);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const newData = {};
  try {
    const { title, artist, price, thumbnail, code, stock, status } = req.body;

    if (
      !title ||
      !artist ||
      !price ||
      !thumbnail ||
      !code ||
      !stock ||
      !status
    ) {
      newData = { title, artist, price, thumbnail, code, stock, status };
      res.status(400).send({ error: "Faltan datos" });
      return;
    }
    const respuesta = await productModel.findByIdAndUpdate(id, newData);
    res.send(respuesta);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  id === undefined ? res.status(400).send({ error: "Faltan datos" }) : null;

  try {
    const respuesta = await productModel.findByIdAndDelete(id);
    res.send(respuesta);
  } catch (err) {
    console.log(err);
  }
});
export default router;