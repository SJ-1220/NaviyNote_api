import { authenticateUser } from "@/middleware/authenticateUser.js";
import express from "express";
import {
    createTodoController,
    getTodoByIdController,
    getTodosController,
    patchTodoController,
} from "./todo.controller.js";

const todoRoutes = express.Router();

todoRoutes.get("/", authenticateUser, getTodosController);
todoRoutes.get("/:id", authenticateUser, getTodoByIdController);
todoRoutes.post("/", authenticateUser, createTodoController);
todoRoutes.patch("/:id", authenticateUser, patchTodoController);
todoRoutes.delete("/:id", authenticateUser, (req, res) => {});

export default todoRoutes;
