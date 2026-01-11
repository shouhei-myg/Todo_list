import { Todo } from "../types/todo";

const BASE_URL = "http://localhost:3001/todos";

// ---------------------------
// Todo一覧取得
// GET /todos
// ---------------------------
export const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch(BASE_URL);
  return res.json();
};

// ---------------------------
// Todo作成
// POST /todos
// ---------------------------
export const createTodo = async (inputValue: string) => {
  await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      inputValue,        // Todo内容
      status: "todo",    // 初期状態は未完了
      createdAt: Date.now(), // 作成日時
    }),
  });
};

// ---------------------------
// Todo更新（編集）
// PUT /todos/:id
// ---------------------------
export const updateTodo = async (id: number, inputValue: string) => {
  await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inputValue }),
  });
};

// ---------------------------
// チェックボックスで編集用にステータス切替
// PUT /todos/:id/status
// ---------------------------
export const toggleTodo = async (id: number, status: "todo" | "done") => {
  await fetch(`${BASE_URL}/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
};

// ---------------------------
// Todo削除
// DELETE /todos/:id
// ---------------------------
export const deleteTodo = async (id: number) => {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
};
