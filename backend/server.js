import express from "express";
import cors from "cors";
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware/auth.js";

const app = express();
app.use(cors());
app.use(express.json());
const sql = neon(process.env.DATABASE_URL);

app.get("/", (req, res) => res.send("API working"));

// Register a new user
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  // 1. basic validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // 2. hash the password (10 = salt rounds)
    const password_hash = await bcrypt.hash(password, 10);

    // 3. insert the user, returning ONLY safe fields (never the hash)
    const result = await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${email}, ${password_hash})
      RETURNING id, email, created_at
    `;

    // 4. success
    res.status(201).json(result[0]);
  } catch (err) {
    // 5. duplicate email (Postgres unique_violation)
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already in use" });
    }
    console.log(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Log a user in
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  // 1. validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // 2. find the user by email
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    const user = users[0];

    // 3. compare the password to the stored hash
    const valid = user && await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 4. create a signed token carrying the user's id
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. send back the token + safe user info
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// List the logged-in user's favorites (newest first)
app.get("/api/favorites", authMiddleware, async (req, res) => {
  const favorites = await sql`
    SELECT * FROM favorites
    WHERE user_id = ${req.userId}
    ORDER BY created_at DESC
  `;
  res.json(favorites);
});

// Add a favorite for the logged-in user
app.post("/api/favorites", authMiddleware, async (req, res) => {
  const { movie_id, title, poster_path, release_date } = req.body;
  const result = await sql`
    INSERT INTO favorites (user_id, movie_id, title, poster_path, release_date)
    VALUES (${req.userId}, ${movie_id}, ${title}, ${poster_path}, ${release_date})
    ON CONFLICT (user_id, movie_id) DO NOTHING
    RETURNING *
  `;
  res.json(result[0] || null);
});

// Remove one of the logged-in user's favorites by movie id
app.delete("/api/favorites/:movieId", authMiddleware, async (req, res) => {
  const { movieId } = req.params;
  await sql`
    DELETE FROM favorites
    WHERE movie_id = ${movieId} AND user_id = ${req.userId}
  `;
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
