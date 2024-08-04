import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./Authenticated";

const ProtectedRoute = ({ children }) => {
	if (isAuthenticated()) {
		return <Navigate to="/dashboard" />;
	}
	return children;
};

export default ProtectedRoute;
