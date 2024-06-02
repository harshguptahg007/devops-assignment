import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import todoRouter from "./router/todoRouter";

const app = express();
const PORT = process.env.BE_PORT || 3000;

app.use(bodyParser.json());

// Use CORS middleware
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, my world!");
});

app.use("/todos", todoRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
