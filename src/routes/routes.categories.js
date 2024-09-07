import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
    const categories = await prisma.category.findMany();
    if (!categories) {
        res.status(404).json({ message: "Categories not found" });
        return;
    }
    res.json(categories);
})

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
        where: { id: Number(id) },
    });
    if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
    }
    res.json(category);
})

router.post("/add", async (req, res) => {
    const { name } = req.body;

    name = name.tolowercase();

    let searchCategory = await prisma.category.findUnique({ where: { name } });
    if (!searchCategory) {
        const category = await prisma.category.create({
            data: { name },
        });
        return res.json(category);
    } else {
        res.json({ message: "Category already exists" });
    }
})

router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    name = name.tolowercase();
    
    let searchCategory = await prisma.category.findUnique({
        where: { id: Number(id) },
    });
    if (!searchCategory) {
        res.status(404).json({ message: "Category not found" });
        return;
    } else {
        await prisma.category.update({
            where: { id: Number(id) },
            data: { name },
        });
        return res.json({ message: "Category updated" });
    }
})

router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    let searchCategory = await prisma.category.findUnique({
        where: { id: Number(id) },
    });
    if (!searchCategory) {
        res.status(404).json({ message: "Category not found" });
        return;
    } else {
        await prisma.category.delete({ where: { id: Number(id) } });
        return res.json({ message: "Category deleted" });
    }
})  

export default router