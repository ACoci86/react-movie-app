import express from "express";
import cors from "cors";
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const app = express();
app.use(cors());
app.use(express.json());
const sql = neon(process.env.DATABASE_URL);

app.get("/", (req, res) => res.send("API working"));

// List all favorites (newest first)
app.get("/api/favorites", async (req, res) => {
  const favorites = await sql`SELECT * FROM favorites ORDER BY created_at DESC`;
  res.json(favorites);
});

// Add a favorite
app.post("/api/favorites", async (req, res) => {
  const { movie_id, title, poster_path, release_date } = req.body;
  const result = await sql`
    INSERT INTO favorites (movie_id, title, poster_path, release_date)
    VALUES (${movie_id}, ${title}, ${poster_path}, ${release_date})
    ON CONFLICT (user_id, movie_id) DO NOTHING
    RETURNING *
  `;
  res.json(result[0] || null);
});

// Remove a favorite by movie id
app.delete("/api/favorites/:movieId", async (req, res) => {
  const { movieId } = req.params;
  await sql`DELETE FROM favorites WHERE movie_id = ${movieId}`;
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
