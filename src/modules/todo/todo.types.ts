export type TodoFilter =
  | { type: "none" }
  | { type: "date"; date: string }
  | { type: "range"; start: string; end: string }
  | { type: "noDate" };