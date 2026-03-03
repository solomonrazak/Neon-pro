
import { useState, useEffect } from "react";
import axios from "axios";
import { MdModeEditOutline, MdOutlineDone } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

function App() {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState("");
  const [editText, setEditText] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ========================
  // FETCH TODOS
  // ========================
  const getTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:8080/todos");
      setTodos(res.data);
    } catch (err) {
      console.error(err.message);
      setError("Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // ADD TODO
  // ========================
  const onSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post("http://localhost:8080/todos", {
        description,
        completed: false,
      });
      setDescription("");
      getTodos();
    } catch (err) {
      console.error(err.message);
      setError("Failed to add todo");
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // SAVE EDIT
  // ========================
  const saveEdit = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`http://localhost:8080/todos/${id}`, {
        description: editText,
      });
      setEditingTodo(null);
      setEditText("");
      getTodos();
    } catch (err) {
      console.error(err.message);
      setError("Failed to update todo");
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // DELETE TODO
  // ========================
  const deleteTodo = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`http://localhost:8080/todos/${id}`);
      setTodos((prev) => prev.filter((todo) => todo.todo_id !== id));
    } catch (err) {
      console.error(err.message);
      setError("Failed to delete todo");
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // TOGGLE COMPLETED
  // ========================
  const toggleCompleted = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const todo = todos.find((t) => t.todo_id === id);
      await axios.put(`http://localhost:8080/todos/${id}`, {
        description: todo.description,
        completed: !todo.completed,
      });

      setTodos((prev) =>
        prev.map((t) =>
          t.todo_id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (err) {
      console.error(err.message);
      setError("Failed to update completion status");
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // LIFECYCLE
  // ========================
  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-800 flex justify-center items-center p-4">
      <div className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-3">
          PERN TODO APP
        </h1>

        {/* ERROR */}
        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-100 px-3 py-2 rounded">
            {error}
          </div>
        )}

        {/* ADD TODO FORM */}
        <form
          onSubmit={onSubmitForm}
          className="mb-4 px-3 flex items-center shadow-md py-2 border border-gray-500 rounded-lg gap-4"
        >
          <input
            className="flex-1 outline-none px-3 py-1"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What needs to be done"
            required
            disabled={loading}
          />
          <button
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-bold py-2 px-4 rounded-lg shadow-md transition"
          >
            {loading ? "Adding..." : "Add Task"}
          </button>
        </form>

        {/* TODO LIST */}
        <div className="space-y-3">
          {loading && todos.length === 0 ? (
            <p className="text-center text-gray-500">Loading tasks...</p>
          ) : todos.length === 0 ? (
            <p className="text-center text-gray-500">No tasks available</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.todo_id}
                className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm"
              >
                {/* LEFT */}
                {editingTodo === todo.todo_id ? (
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      className="flex-1 border px-3 py-1.5 rounded-lg border-gray-200 outline-none
                                 focus:ring-2 focus:ring-blue-300 text-gray-600 shadow-inner"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      autoFocus
                      disabled={loading}
                    />

                    <button
                      onClick={() => saveEdit(todo.todo_id)}
                      disabled={loading}
                      className="h-8 w-8 flex items-center justify-center rounded-full
                                 bg-green-500 text-white shadow-sm
                                 hover:bg-green-600 hover:scale-105 transition disabled:opacity-60"
                    >
                      <MdOutlineDone size={18} />
                    </button>

                    <button
                      onClick={() => setEditingTodo(null)}
                      disabled={loading}
                      className="h-8 w-8 flex items-center justify-center rounded-full
                                 bg-gray-200 text-gray-600 shadow-sm
                                 hover:bg-red-100 hover:text-red-600 hover:scale-105 transition disabled:opacity-60"
                    >
                      <IoClose size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 overflow-hidden">
                    <button
                      onClick={() => toggleCompleted(todo.todo_id)}
                      disabled={loading}
                      className={`flex-shrink-0 h-6 w-6 border-2 rounded-full flex items-center justify-center ${
                        todo.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {todo.completed && <MdOutlineDone size={16} />}
                    </button>
                    <span className="text-gray-700">
                      {todo.description}
                    </span>
                  </div>
                )}

                {/* RIGHT */}
                {editingTodo !== todo.todo_id && (
                  <div className="flex items-center ml-auto">
                    <button
                      onClick={() => {
                        setEditingTodo(todo.todo_id);
                        setEditText(todo.description);
                      }}
                      disabled={loading}
                      className="p-2 text-gray-500 hover:text-gray-700 transition disabled:opacity-60"
                    >
                      <MdModeEditOutline />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.todo_id)}
                      disabled={loading}
                      className="p-2 text-red-500 hover:text-red-700 transition disabled:opacity-60"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

