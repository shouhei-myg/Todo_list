import './App.css';
import React, { useState } from "react";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  type Todo = {
    inputValue: string;
    id: number;
    checked: boolean;
    createdAt: number;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTodo: Todo = {
      inputValue: inputValue,
      id: todos.length,
      checked: false,
      createdAt: Date.now()
    }
    setTodos([newTodo, ...todos]);
    setInputValue("");
  }

  const handleEdit = (id: number, inputValue: string) => {
    const newTodos =todos.map((todo) => {
      if (todo.id === id) {
        todo.inputValue = inputValue;
      }
      return todo
    })
    setTodos(newTodos);
  }

  const handleCheckd = (id: number, checked: boolean) => {
    const newTodos =todos.map((todo) => {
      if (todo.id === id) {
        todo.checked = !checked;
      }
      return todo
    })
    setTodos(newTodos);
  }

  const handleDelete = (id: number) => {
    const newTodos = todos.filter((todo) => todo.id !== id)
    setTodos(newTodos);
  }


  return (
    <div className="App">
      <div>
        <h2>Todo list</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => handleChange(e)} 
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
