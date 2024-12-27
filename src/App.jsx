import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/" element={<Login />} /> {/* Sätt Login som startsida */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
