// components/ProtectedRoute.jsx
import { Navigate } from "react-router";
import { useAuth } from "../auth/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Laddar...</div>;
    }

    if (!user || !user.uid || !user.emailVerified) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;