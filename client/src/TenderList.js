import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get } from "./TenderClient";
import "./TenderList.css";

const TendersList = () => {
	const { pageNumber } = useParams();
	const currentPage = pageNumber ? parseInt(pageNumber, 10) : 1;
	const [tenders, setTenders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState({
		itemsPerPage: 25,
		currentPage: currentPage,
		totalPages: 1,
	});
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const fetchTenders = async (page) => {
		setLoading(true);
		try {
			const data = await get(`/api/tenders?page=${page}`);
			if (data && data.results && data.pagination) {
				setTenders(data.results);
				setPagination(data.pagination);
				setError(null);
			} else {
				throw new Error("Server error");
			}
		} catch (error) {
			setError("Error fetching tenders: " + error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTenders(currentPage);
	}, [currentPage]);

	const loadNextPage = () => {
		if (pagination.currentPage < pagination.totalPages && !loading) {
			navigate(`/dashboard/page/${pagination.currentPage + 1}`);
		}
	};

	const loadPreviousPage = () => {
		if (pagination.currentPage > 1 && !loading) {
			navigate(`/dashboard/page/${pagination.currentPage - 1}`);
		}
	};

	return (
		<div className="tenders-container">
			<h2>Tenders List</h2>
			{error && <p className="error-message">{error}</p>}
			<table className="tenders-table">
				<thead>
					<tr>
						<th>Tender ID</th>
						<th>Tender Title</th>
						<th>Tender Created Date</th>
						<th>Tender Announcement Date</th>
						<th>Tender Project Deadline Date</th>
						<th>Tender Status</th>
					</tr>
				</thead>
				<tbody>
					{tenders.map((tender) => (
						<tr key={tender.id}>
							<td>{tender.id}</td>
							<td>{tender.title}</td>
							<td>{new Date(tender.creation_date).toLocaleDateString()}</td>
							<td>{new Date(tender.announcement_date).toLocaleDateString()}</td>
							<td>{new Date(tender.deadline).toLocaleDateString()}</td>
							<td>{tender.status}</td>
						</tr>
					))}
				</tbody>
			</table>
			{loading && <p>Loading...</p>}
			<div className="pagination-buttons">
				{pagination.currentPage > 1 && (
					<button onClick={loadPreviousPage} disabled={loading}>
						Previous Page
					</button>
				)}
				{pagination.currentPage < pagination.totalPages && (
					<button onClick={loadNextPage} disabled={loading}>
						Next Page
					</button>
				)}
			</div>
		</div>
	);
};

export default TendersList;
