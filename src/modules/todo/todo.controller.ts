import { type Request, type Response } from "express";
import { createTodo } from "./todo.service.js";

export const createTodoController = async (req: Request, res: Response) => {
  const userId = res.locals.userId as string;
  const { task, completed, important, date, memoId } = req.body;

  if (typeof task !== "string" || !task.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Todo가 없습니다." });
  }
  try {
    const newTodo = await createTodo({
      userId,
      task,
      completed,
      important,
      date,
      memoId,
    });

    res.status(201).json({ success: true, todo: newTodo });
  } catch (error) {
    console.error("Todo 생성 중 에러:", error);
    res
      .status(500)
      .json({ success: false, message: "Todo 생성 중 에러가 발생했습니다." });
  }
};
