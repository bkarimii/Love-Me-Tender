import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get } from "./TenderClient";

const BuyerTenderList = () => {
	const { pageNumber } = useParams();
	const currentPage = pageNumber ? parseInt(pageNumber, 10) : 1;
	const [buyerTenders, setBuyerTenders] = useState([]);
	const [errorMsg, setErrorMsg] = useState(null);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState({
		itemsPerPage: 5,
		currentPage: currentPage,
		totalPages: 1,
	});
	const navigate = useNavigate();

	function dateFormat(date) {
		return date ? date.split("T")[0] : "N/A";
	}

	const fetchTenders = async (page) => {
		setLoading(true);
		try {
			const data = await get(`/api/buyer-tender?page=${page}`);
			setBuyerTenders(data.results);
			setPagination(data.pagination);
			setErrorMsg(null);
		} catch (error) {
			setErrorMsg("Error fetching tenders");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTenders(currentPage);
	}, [currentPage]);

	const loadNextPage = () => {
		if (pagination.currentPage < pagination.totalPages && !loading) {
			navigate(`/buyer-tender/page/${pagination.currentPage + 1}`);
		}
	};

	const loadPreviousPage = () => {
		if (pagination.currentPage > 1 && !loading) {
			navigate(`/buyer-tender/page/${pagination.currentPage - 1}`);
		}
	};

	if (errorMsg !== null) {
		return <div>{errorMsg}</div>;
	}

	if (loading) {
		return <div>Loading!!</div>;
	}

	return (
		<main>
			<div className="tenders-container">
				<h2>My Tenders List</h2>
				{errorMsg && <p className="error-message">{errorMsg}</p>}
				<table className="tenders-table">
					<thead>
						<tr>
							<th>Tender ID</th>
							<th>Tender Title</th>
							<th>Tender Created Date</th>
							<th>Tender Announcement Date</th>
							<th>Tender Project Deadline Date</th>
							<th>Tender Closing Date</th>
							<th>Tender Description</th>
							<th>Tender Cost</th>
							<th>Tender No. of bids</th>
							<th>Tender Status</th>
							<th>Last Update</th>
						</tr>
					</thead>
					<tbody>
						{buyerTenders.map((tender) => (
							<tr key={tender.id}>
								<td>{tender.id}</td>
								<td>{tender.title}</td>
								<td>{dateFormat(tender.creation_date)}</td>
								<td>{dateFormat(tender.announcement_date)}</td>
								<td>{dateFormat(tender.deadline)}</td>
								<td>{dateFormat(tender.closing_date)}</td>
								<td>{tender.description.substring(0, 200)}</td>
								<td>{tender.no_of_bids_received}</td>
								<td>£{tender.cost}</td>
								<td>{tender.status}</td>
								<td>{dateFormat(tender.last_update)}</td>
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
		</main>
	);
};

export default BuyerTenderList;
