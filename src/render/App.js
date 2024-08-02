
// // Using class component //
// import React from "react"
// class App extends React.Component{
//   render() {
//     return <h1>Hello from class</h1>
//   }
// }
// export default App;



// Using functions //
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import { useState } from "react";
import AddTask from "./components/AddTask";


function App() {

  const [showAddTask, setShowAddTask] = useState(true)

  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: "Doctors Appointment",
      day: "Monday",
      reminder: true,
    },
    {
      id: 2,
      text: "U Meeting",
      day: "Friday",
      reminder: true,
    },
    {
      id: 3,
      text: "Exam",
      day: "Sunday",
      reminder: true,
    }
  ])

  // Delete a task //
  const deleteTask = (id) => {
    console.log("Delete: ", id)
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Toggle reminder //
  const toggleReminder = (id) => {
    console.log("Reminder:", id)
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, reminder: !task.reminder } : task))
  }

  // Add task //
  const addTask = (task) => {
    console.log(task)
    const id = Math.floor(Math.random() * 1000) + 1
    const newTask = { id, ...task }
    setTasks([...tasks, newTask])
  }

  return (
    <div className="container">
      <Header
        title="Task Tracker"
        onAdd={() => setShowAddTask(!showAddTask)} 
        showAdd={showAddTask}
      />
      {showAddTask && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : "No tasks to show"}
      {/* <Header /> */}
      {/* <h1>Hello world!</h1>
      <h2>Hello {name}</h2> */}
    </div>
  );
}
export default App;


