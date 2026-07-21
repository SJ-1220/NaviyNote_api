export type TodoFilter =
  | { type: "none" }
  | { type: "date"; date: string }
  | { type: "range"; start: string; end: string }
  | { type: "noDate" };

export type PatchTodoInput = {
  task?: string;
  completed?: boolean;
  important?: boolean;
  date?: string | null;
  memoId?: string | null;
};
