const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Get all books
app.get("/api/books", async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        quantity: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    // const books = await prisma.book.findMany({
    //   orderBy: { id: "desc" },
    // });
    res.json(books);
  } catch (error) {
    console.error("GET /api/books failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get single book
app.get("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        title: true,
        quantity: true,

        createdAt: true,
        updatedAt: true,
      },
    });
    if (!book) return res.status(404).json({ error: "Not found" });
    res.json(book);
  } catch (error) {
    console.error("GET /api/books/:id failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new book
app.post("/api/books", async (req, res) => {
  const { title, quantity, description } = req.body;
  try {
    const book = await prisma.book.create({
      data: {
        title,
        quantity: parseInt(quantity) || 1,
      },
      select: {
        id: true,
        title: true,
        quantity: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a book
app.put("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  const { title, quantity, description } = req.body;
  try {
    const book = await prisma.book.update({
      where: { id: parseInt(id) },
      data: {
        title,
        quantity: parseInt(quantity),
      },
      select: {
        id: true,
        title: true,
        quantity: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a book
app.delete("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.book.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
