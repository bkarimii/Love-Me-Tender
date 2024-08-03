import React from "react";
import TendersList from "../TenderList";

export function Dashboard() {
	return (
		<main role="main">
			<div>
				<h1>Tenders</h1>
				<TendersList />
			</div>
		</main>
	);
}

export default Dashboard;
