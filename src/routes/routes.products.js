import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  const products = await prisma.product.findMany();

  if (!products) {
    res.status(404).json({ message: "Products not found" });
    return;
  }

  res.json(products);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  res.json(product);
});

router.post("/add", async (req, res) => {
  const { name, price, stock, categoryId } = req.body;
  name = name.tolowercase();

  let searchProduct = await prisma.product.findUnique({ where: { name } });
  if (!searchProduct) {
    const product = await prisma.product.create({
      data: { name, price, stock, categoryId },
    });
    return res.json(product);
  } else {
    res.json({ message: "Product already exists" });
  }
});

router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;

  name = name.tolowercase();

  let searchProduct = await prisma.product.findUnique({
    where: { id: Number(id) },
  });
  if (!searchProduct) {
    res.status(404).json({ message: "Product not found" });
    return;
  } else {
    await prisma.product.update({
      where: { id: Number(id) },
      data: { name, price, stock },
    });
    return res.json({ message: "Product updated" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  let searchProduct = await prisma.product.findUnique({
    where: { id: Number(id) },
  });
  if (!searchProduct) {
    res.status(404).json({ message: "Product not found" });
    return;
  } else {
    await prisma.product.delete({ where: { id: Number(id) } });
    return res.json({ message: "Product deleted" });
  }
});

export default router;
