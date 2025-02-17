import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import TermsAndConditions from "./components/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import NotFoundPage from "./components/404page";
import ResetPassword from "./components/ResetPassword";

function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
