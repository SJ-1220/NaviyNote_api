import { prisma } from "@/config/prisma.js";
import type { PatchTodoInput, TodoFilter } from "./todo.types.js";
export const createTodo = async (todoData: {
  userId: string;
  task: string;
  completed: boolean;
  important: boolean;
  date?: string;
  memoId?: string;
}) => {
  const newTodo = await prisma.todo.create({
    data: {
      userId: todoData.userId,
      task: todoData.task,
      completed: todoData.completed,
      important: todoData.important,
      date: todoData.date ? new Date(todoData.date) : null,
      memoId: todoData.memoId || null,
    },
  });
  return newTodo;
};

export const getTodosByUserId = async (userId: string, filter: TodoFilter) => {
  const todos = await prisma.todo.findMany({
    orderBy: { date: "asc" },
    where: {
      userId: userId,
      ...(filter.type === "date" && { date: new Date(filter.date) }),
      ...(filter.type === "range" &&
        filter.start &&
        filter.end && {
          date: { gte: new Date(filter.start), lte: new Date(filter.end) },
        }),
      ...(filter.type === "noDate" && { date: null }),
      ...(filter.type === "none" && {}),
    },
  });
  return todos;
};

export const getTodoById = async (userId: string, todoId: string) => {
  const todo = await prisma.todo.findFirst({
    where: {
      userId: userId,
      id: todoId,
    },
  });
  return todo;
};

export const patchTodo = async (todoId: string, data: PatchTodoInput) => {
  const todo = await prisma.todo.update({ where: { id: todoId }, data });
  return todo;
};
