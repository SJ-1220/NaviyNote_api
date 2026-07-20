import { prisma } from "@/config/prisma.js";

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
