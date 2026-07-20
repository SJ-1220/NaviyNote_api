import { authenticateUser } from "@/middleware/authenticateUser.js";
import express from "express";
import { createTodoController, getTodosController } from "./todo.controller.js";

const todoRoutes = express.Router();

todoRoutes.get("/", authenticateUser, getTodosController);
todoRoutes.get("/:id", authenticateUser, (req, res) => {});
todoRoutes.post("/", authenticateUser, createTodoController);
todoRoutes.patch("/:id", authenticateUser, (req, res) => {});
todoRoutes.delete("/:id", authenticateUser, (req, res) => {});

export default todoRoutes;
