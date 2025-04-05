// components/PublicRoute.jsx
import { Navigate } from "react-router";
import { useAuth } from "../auth/AuthContext";

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Laddar...</div>;
    }

    if (user && user.uid && user.emailVerified) {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default PublicRoute;