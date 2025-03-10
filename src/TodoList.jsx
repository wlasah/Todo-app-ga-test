import { useState, useEffect } from "react";

export default function TodoList() {
  // Initialize states
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, completed
  const [darkMode, setDarkMode] = useState(false);
  const [animatingIndex, setAnimatingIndex] = useState(null);

  // Load dark mode preference and saved tasks from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    document.body.className = savedDarkMode ? "dark-mode" : "";
    
    // Load saved tasks
    try {
      const savedTasks = JSON.parse(localStorage.getItem("todos") || "[]");
      setTasks(savedTasks);
    } catch (error) {
      console.error("Failed to load saved tasks", error);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(tasks));
  }, [tasks]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    document.body.className = newDarkMode ? "dark-mode" : "";
  };

  // Add a new task
  const addTask = () => {
    if (task.trim() === "") return;
    setTasks([...tasks, { text: task, completed: false, createdAt: new Date().toISOString() }]);
    setTask("");
  };

  // Remove a task with animation
  const removeTask = (index) => {
    setAnimatingIndex(index);
    setTimeout(() => {
      setTasks(tasks.filter((_, i) => i !== index));
      setAnimatingIndex(null);
    }, 300); // Match this time to the CSS animation duration
  };

  // Toggle completed status
  const toggleComplete = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  // Start editing a task
  const startEdit = (index) => {
    setEditIndex(index);
    setEditText(tasks[index].text);
  };

  // Save edited task
  const saveEdit = () => {
    if (editText.trim() === "") return;
    const newTasks = [...tasks];
    newTasks[editIndex].text = editText;
    setTasks(newTasks);
    setEditIndex(null);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditIndex(null);
  };

  // Handle keypress events
  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    } else if (e.key === "Escape" && editIndex !== null) {
      cancelEdit();
    }
  };

  // Get filtered tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true; // "all" filter
  });

  return (
    <div className="todo-container">
      <div className="header">
        <h2>My Tasks</h2>
        <button 
          className="dark-mode-toggle" 
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
      
      <div className="add-task">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, addTask)}
        />
        <button className="add-btn" onClick={addTask}>Add Task</button>
      </div>
      
      <div className="filters">
        <button 
          className={filter === "all" ? "active" : ""} 
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button 
          className={filter === "active" ? "active" : ""} 
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button 
          className={filter === "completed" ? "active" : ""} 
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>
      
      {filteredTasks.length === 0 ? (
        <p className="empty-message">
          {filter === "all" 
            ? "Your task list is empty. Add a task to get started!" 
            : filter === "active" 
              ? "No active tasks remaining" 
              : "No completed tasks yet"}
        </p>
      ) : (
        <ul className="task-list">
          {filteredTasks.map((t, index) => (
            <li 
              key={index} 
              className={`${t.completed ? "completed" : ""} ${animatingIndex === index ? "task-exit" : ""}`}
            >
              {editIndex === index ? (
                <div className="edit-container">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, saveEdit)}
                    onKeyDown={(e) => e.key === "Escape" && cancelEdit()}
                    autoFocus
                  />
                  <div className="edit-buttons">
                    <button onClick={saveEdit}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="task-item">
                  <div className="task-content">
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggleComplete(index)}
                    />
                    <span className="task-text" title={t.text}>{t.text}</span>
                  </div>
                  <div className="task-actions">
                    <button 
                      className="edit-btn" 
                      onClick={() => startEdit(index)}
                      disabled={t.completed}
                      title={t.completed ? "Cannot edit completed task" : "Edit task"}
                    >
                      ✏️
                    </button>
                    <button 
                      className="delete-btn" 
                      onClick={() => removeTask(index)}
                      title="Delete task"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      
      <div className="stats">
        <p>{tasks.filter(t => !t.completed).length} task{tasks.filter(t => !t.completed).length !== 1 ? 's' : ''} remaining</p>
      </div>
    </div>
  );
}
