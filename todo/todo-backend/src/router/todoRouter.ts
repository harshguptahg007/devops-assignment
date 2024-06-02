import { Router } from "express";
import { pool } from "../database/db";
import { Todo } from "../model/Todo";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Todo");
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const newTodo: Todo = req.body;
  try {
    const [result] = await pool.query("INSERT INTO Todo SET ?", newTodo);
    res.status(201).json({ id: (result as any).insertId, ...newTodo });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
