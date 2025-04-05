import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
//Componenets
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import TermsAndConditions from "./components/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import NotFoundPage from "./components/404page";
import AuthActionHandler from "./components/auth/AuthActionHandler";//<--Auth
//Route handlers
import ProtectedRoute from "./components/route/ProtectedRoute";
import PublicRoute from "./components/route/PublicRoute";
//Context
import { JobProvider } from "./components/JobContext";
import { useAuth } from "./components/auth/AuthContext";//<--Auth

function App() {
    const { user, loading: authLoading } = useAuth();

    return (
        <JobProvider user={user}>
            <Router>
                <div className="app">
                    <Routes>
                        {/* Publika rutter: redirect inloggade användare */}
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/"
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />

                        {/* Skyddade rutter: endast för inloggade och verifierade */}
                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />

                        {/* Övriga sidor */}
                        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/auth-action" element={<AuthActionHandler />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
            </Router>
        </JobProvider>
    );
}

export default App;