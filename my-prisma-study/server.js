const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;
// Configure DB SSL via env: set DB_SSL=true in production and optionally
// DB_SSL_REJECT_UNAUTHORIZED=false to disable verification (not recommended).
const enableDbSsl = process.env.DB_SSL === "true";
const dbSsl = enableDbSsl
  ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false" }
  : undefined;

const pool = new Pool({
  connectionString: databaseUrl,
  ...(dbSsl ? { ssl: dbSsl } : {}),
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 5001;

// Basic security and middleware
app.use(helmet());

// Logging
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "15") * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || "100"),
});
app.use(limiter);

// Configure CORS with an allowlist from environment variable `CORS_ORIGINS`.
// In production set CORS_ORIGINS to a comma-separated list of allowed origins.
// In development, localhost origins are allowed by default when CORS_ORIGINS is not set.
const rawCors = process.env.CORS_ORIGINS || "";
const defaultDevOrigins = "http://localhost:5173,http://localhost:3000";
const allowedOrigins = (
  rawCors || (process.env.NODE_ENV === "production" ? "" : defaultDevOrigins)
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow non-browser requests (curl, server-to-server) where origin is undefined
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0)
        return callback(new Error("CORS: no allowed origins configured"));
      if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
      return callback(new Error("CORS: origin not allowed"));
    },
    credentials: true,
  }),
);
// Limit request body size
app.use(express.json({ limit: process.env.REQUEST_BODY_LIMIT || "50kb" }));

// Simple error handler to convert CORS errors into 403 responses
app.use((err, req, res, next) => {
  if (err && String(err.message).startsWith("CORS:")) {
    return res.status(403).json({ error: err.message });
  }
  next(err);
});

// Response wrapper: normalize successful responses to {code, message, data}
app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    // If already wrapped, pass through
    if (
      body &&
      typeof body === "object" &&
      ("code" in body || "data" in body)
    ) {
      return originalJson(body);
    }
    if (res.statusCode >= 400) {
      const message =
        (body && (body.error || body.message)) || String(body) || "error";
      return originalJson({ code: 0, message, data: null });
    }
    return originalJson({ code: 1, message: "", data: body });
  };
  next();
});

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
      include: {
        author: true,
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

app.get("/api/author", async (req, res) => {
  const { name, bookname } = req.query;

  try {
    const cleanName = name ? String(name).trim() : "";
    const cleanBookName = bookname ? String(bookname).trim() : "";

    const where = {
      ...(cleanName && { name: { contains: cleanName, mode: "insensitive" } }),
      ...(cleanBookName && {
        books: {
          some: {
            title: { contains: cleanBookName, mode: "insensitive" },
          },
        },
      }),
    };

    const author = await prisma.author.findMany({
      where,
      include: {
        books: {
          take: 5,
          orderBy: { createdAt: "desc" },
          select: { title: true },
        },
      },
    });
    res.json(author);
  } catch (error) {
    console.error("GET /api/author failed:", error);
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
  const { title, quantity, author, description } = req.body;
  try {
    const book = await prisma.book.create({
      data: {
        title,
        quantity: parseInt(quantity),
        description,
        author: {
          connectOrCreate: {
            where: { name: author },
            create: { name: author },
          },
        },
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

// Graceful shutdown
async function shutdown(signal) {
  try {
    console.log(`Received ${signal}, shutting down gracefully...`);
    await prisma.$disconnect();
    try {
      await pool.end();
    } catch (e) {
      // ignore
    }
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
