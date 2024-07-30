import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
	return (
		<main>
			<h1>Admin Dashboard</h1>
			<Link to="/list-tenders">
				<button>View Tenders</button>
			</Link>
		</main>
	);
};

export default AdminDashboard;
