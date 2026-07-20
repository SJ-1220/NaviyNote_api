import { type Request, type Response } from "express";
import { createTodo, getTodosByUserId } from "./todo.service.js";
import type { TodoFilter } from "./todo.types.js";

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

function parseTodoFilter(
  query: Request["query"],
): { ok: true; filter: TodoFilter } | { ok: false; message: string } {
  const date = typeof query.date === "string" ? query.date : undefined;
  const start = typeof query.start === "string" ? query.start : undefined;
  const end = typeof query.end === "string" ? query.end : undefined;
  const noDate = typeof query.noDate === "string" ? query.noDate : undefined;

  const hasRangePart = start !== undefined || end !== undefined;
  if (hasRangePart && !(start !== undefined && end !== undefined)) {
    return { ok: false, message: "start와 end는 함께 전달되어야 합니다." };
  }

  const hasDate = date !== undefined && date.trim() !== "";
  const hasRange =
    start !== undefined &&
    start.trim() !== "" &&
    end !== undefined &&
    end.trim() !== "";
  const hasNoDate = noDate === "true";

  const activeFilterCount = [hasDate, hasRange, hasNoDate].filter(
    Boolean,
  ).length;

  if (activeFilterCount > 1) {
    return {
      ok: false,
      message: "date, start&end, noDate 중 하나만 선택할 수 있습니다.",
    };
  }

  if (hasDate) return { ok: true, filter: { type: "date", date: date! } };
  if (hasRange)
    return { ok: true, filter: { type: "range", start: start!, end: end! } };
  if (hasNoDate) return { ok: true, filter: { type: "noDate" } };

  return { ok: true, filter: { type: "none" } };
}

export const getTodosController = async (req: Request, res: Response) => {
  const userId = res.locals.userId as string;

  const filterResult = parseTodoFilter(req.query);
  if (!filterResult.ok) {
    return res
      .status(400)
      .json({ success: false, message: filterResult.message });
  }

  try {
    const todos = await getTodosByUserId(userId, filterResult.filter);

    res.status(200).json({ success: true, todos });
  } catch (error) {
    console.error("Todo 조회 중 에러:", error);
    res
      .status(500)
      .json({ success: false, message: "Todo 조회 중 에러가 발생했습니다." });
  }
};
