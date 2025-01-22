import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home"

function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
