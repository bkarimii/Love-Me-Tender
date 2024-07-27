import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
	return (
		<div>
			<h1>Admin Dashboard</h1>
			<Link to="/list-tenders">
				<button>View Tenders</button>
			</Link>
		</div>
	);
};

export default AdminDashboard;
