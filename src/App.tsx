import './App.css';
import React, { useEffect, useState } from "react";
import { Todo } from "./types/todo";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
} from "./api/todoApi";

function App() {
  // ---------------------------
  // State
  // ---------------------------
  const [inputValue, setInputValue] = useState(""); // 新規Todo入力
  const [todos, setTodos] = useState<Todo[]>([]);   // Todo一覧
  const [view, setView] = useState<"todo" | "done">("todo"); // 表示切替
  const [editEnabled, setEditEnabled] = useState<{ [key: number]: boolean }>({}); // チェックで編集許可

  // ---------------------------
  // Todo取得
  // ---------------------------
  const loadTodos = async () => {
    const data = await fetchTodos();
    setTodos(data);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  // ---------------------------
  // 新規Todo作成
  // ---------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    await createTodo(inputValue);
    setInputValue("");
    loadTodos();
  };

  // ---------------------------
  // Todo編集（inputのblur時）
  // ---------------------------
  const handleEdit = async (id: number, value: string) => {
    await updateTodo(id, value);
    loadTodos();
  };

  // ---------------------------
  // Todo削除
  // ---------------------------
  const handleDelete = async (id: number) => {
    await deleteTodo(id);
    loadTodos();
  };

  // ---------------------------
  // 完了ボタン押下
  // ---------------------------
  const handleDone = async (id: number) => {
    await fetch(`http://localhost:3001/todos/${id}/done`, { method: "PUT" });
    loadTodos();
  };

  // ---------------------------
  // 表示切替（未完了 / 完了済み）
  // ---------------------------
  const visibleTodos = todos.filter((todo) =>
    view === "todo" ? todo.status === "todo" : todo.status === "done"
  );

  return (
    <div className="App">
      <div>
        <h2>Todo list</h2>

        {/* ページ切替ボタン */}
        <div style={{ marginBottom: "16px" }}>
          <button onClick={() => setView(view === "todo" ? "done" : "todo")}>
            {view === "todo" ? "完了一覧" : "未完了一覧"}
          </button>
        </div>
        {/* 新規Todo入力 */}
        {view === "todo" && (
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)} 
              className="inputText" 
              required
            />
            <input
              type="submit"
              value="作成"
              className="submitButton"
              disabled={!inputValue.trim()}
            />
          </form>
        )}

        {/* Todo一覧 */}
        <ul className='todoList'>
        {visibleTodos.map((todo) => (
          <li key={todo.id}>
            <p>{new Date(todo.createdAt).toLocaleString()}</p>

            {/* チェックボックス：編集可能にする */}
            <input
              type="checkbox"
              checked={!!editEnabled[todo.id]}
              onChange={() =>
                setEditEnabled(prev => ({ ...prev, [todo.id]: !prev[todo.id] }))
              }
              disabled={todo.status === "done"} // 完了タスクは編集不可
            />

            {/* Todo入力欄 */}
            <input
              type="text"
              value={todo.inputValue}
              disabled={!editEnabled[todo.id] || todo.status === "done"} // 完了済み or チェックなしは編集不可
              onChange={(e) =>
                setTodos(prev =>
                  prev.map(t =>
                    t.id === todo.id ? { ...t, inputValue: e.target.value } : t
                  )
                )
              }
              onBlur={(e) => handleEdit(todo.id, e.target.value)}
            />

            {/* 完了ボタン */}
            <button onClick={() => handleDone(todo.id)} disabled={todo.status === "done"}>
              完了
            </button>

            {/* 削除ボタン */}
            <button onClick={() => handleDelete(todo.id)}>削除</button>
          </li>
        ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
