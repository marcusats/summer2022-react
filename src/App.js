import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import UnityA from "./UnityA"
import UserProfile from "./UserProfile"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<UserProfile />} />
        <Route path="/Unity" element={<UnityA />} />
      </Routes>
    </div>
  );
}

export default App;