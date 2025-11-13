import { pool } from "../db.js";
import { validateUser } from "../schemas/users.schema.js";

export const getUsers = async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM users ORDER BY id ASC");
  res.json(rows);
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(`SELECT * FROM users WHERE id = ${id}`);

  if (rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(rows[0]);
};

export const createUser = async (req, res) => {
  try {
    const result = validateUser(req.body)
    if (result.error) {
      return res.status(400).json({error: JSON.parse(result.error.message)})
    }

    const { name, email } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  const { rows, rowCount } = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id]
  );
  if (rowCount === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(rows);
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const result = await pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
    [name, email, id]
  );
  res.json({ message: "User edited" });
};
