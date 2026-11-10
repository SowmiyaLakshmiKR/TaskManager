
import { useState, useEffect } from "react";
import "./App.css";

const configuredApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_BASE_URL = (
  /^https?:\/\//i.test(configuredApiUrl)
    ? configuredApiUrl
    : `https://${configuredApiUrl}`
).replace(/\/+$/, "");
const API = `${API_BASE_URL}/tasks`;

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setTasks(data);
    } catch {
      setMessage("Unable to connect to backend!");
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadTasks = async () => {
      try {
        const response = await fetch(API);
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (!cancelled) setTasks(data);
      } catch {
        if (!cancelled) setMessage("Unable to connect to backend!");
      }
    };

    loadTasks();

    return () => {
      cancelled = true;
    };
  }, []);

  const addTask = async () => {
    if (!title.trim()) {
      setMessage("Please enter a task!");
      return;
    }

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });

      if (!response.ok) throw new Error();

      setTitle("");
      setMessage("Task added successfully!");
      fetchTasks();
    } catch {
      setMessage("Error adding task!");
    }
  };

  const updateTask = async (id, status) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error();

      setMessage("Task updated successfully!");
      fetchTasks();
    } catch {
      setMessage("Error updating task!");
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error();

      setMessage("Task deleted successfully!");
      fetchTasks();
    } catch {
      setMessage("Error deleting task!");
    }
  };

  const statuses = ["Pending", "Ongoing", "Completed"];

  return (
    <div className="app">
      <header>
        <h1>Task Manager</h1>
        <p>Organize your work. Achieve your goals.</p>
      </header>

      <div className="add-section">
        <input
          type="text"
          placeholder="Enter your task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />

        <button className="add-btn" onClick={addTask}>
          + Add Task
        </button>
      </div>

      {message && (
        <p className="message">{message}</p>
      )}

      <div className="task-container">
        {statuses.map((status) => {
          const filteredTasks = tasks.filter(
            (task) => task.status === status
          );

          return (
            <div className="task-column" key={status}>
              <h2>{status} Tasks ({filteredTasks.length})</h2>

              {filteredTasks.length === 0 && (
                <p className="empty">No tasks available</p>
              )}

              {filteredTasks.map((task) => (
                <div className="task-card" key={task._id}>
                  <h3>{task.title}</h3>
                  <p>Status: {task.status}</p>

                  {status !== "Ongoing" && (
                    <button
                      className="ongoing-btn"
                      onClick={() =>
                        updateTask(task._id, "Ongoing")
                      }
                    >
                      Ongoing
                    </button>
                  )}

                  {status !== "Completed" && (
                    <button
                      className="complete-btn"
                      onClick={() =>
                        updateTask(task._id, "Completed")
                      }
                    >
                      Complete
                    </button>
                  )}

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
