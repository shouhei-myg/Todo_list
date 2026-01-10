import './App.css';
import React, { useEffect, useState } from "react";

function App() {

  useEffect(() => {
    const fetchTodos = async () => {
      const res = await fetch("http://localhost:3001/todos");
      const data = await res.json();
      setTodos(data);
    };
    fetchTodos();
  }, []);
  
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  type Todo = {
    id: number;
    inputValue: string;
    checked: boolean;
    createdAt: number;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
  
    await fetch("http://localhost:3001/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inputValue,
        checked: false,
        createdAt: Date.now(),
      }),
    });
  
    setInputValue("");
  
    const res = await fetch("http://localhost:3001/todos");
    const data = await res.json();
    setTodos(data);
  };

  const handleEdit = (id: number, inputValue: string) => {
    const newTodos =todos.map((todo) => {
      if (todo.id === id) {
        todo.inputValue = inputValue;
      }
      return todo
    })
    setTodos(newTodos);
  }

  const handleCheckd = async (id: number, checked: boolean) => {
    await fetch(`http://localhost:3001/todos/${id}/check`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checked: !checked }),
    });

    // ★ 必ず GET し直す
    const res = await fetch("http://localhost:3001/todos");
    const data = await res.json();
    setTodos(data);
  };

  const handleDelete = (id: number) => {
    const newTodos = todos.filter((todo) => todo.id !== id)
    setTodos(newTodos);
  }  

  if (!Array.isArray(todos)) {
    console.error("todos is not array:", todos);
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <div>
        <h2>Todo list</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} 
            className='inputText' 
            required
          />
          <input type="submit" value="作成" className="submitButton" disabled={!inputValue.trim()}/>
        </form>
        <ul className='todoList'>
          {todos.map((todo) => (
            <li key={todo.id}>
              <p>{new Date(todo.createdAt).toLocaleString()}</p>
              <input 
                type="text" 
                onChange={(e) => handleEdit(todo.id, e.target.value)} 
                className='inputText' 
                value={todo.inputValue}
                disabled={!todo.checked}
              />
              <input 
                type="checkbox" 
                onChange={(e) => handleCheckd(todo.id, todo.checked)} 
              />
              <button  onClick={() => handleDelete(todo.id)}>削除</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
