// Using functions //
import Header from "./components/Header";
import { useState } from "react";
import Login from "./components/Login";


function App() {

  const getUser = ({username, password}) => {
    console.log("getUser:")
    console.log(username, password)

    window.electronAPI.login({ username, password });
  }

  return (
    <div className="container">
      <Header title="Login" />
      <Login getUser={getUser} />
    </div>
  );
}
export default App;


