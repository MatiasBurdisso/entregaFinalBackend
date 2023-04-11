import { Router } from "express";

const router = Router();

router.get("/productos", async (req, res) => {
  res.render("productos", { title: "Productos" });
});

router.get("/carrito", async (req, res) => {
  res.render("carrito", { title: "Carrito" });
});

export default router;