import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children }) {
    const { token } = useAuth();

    // Not logged in -> send to the login page
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Logged in -> show the page
    return children;
}

export default ProtectedRoute;
