import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { get } from "./TenderClient";
import "./TenderList.css";

const TendersList = () => {
	const { pageNumber } = useParams();
	const currentPage = pageNumber ? parseInt(pageNumber, 10) : 1;
	const [tenders, setTenders] = useState([]);
	const [bids, setBids] = useState([]);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState({
		itemsPerPage: 25,
		currentPage: currentPage,
		totalPages: 1,
	});
	const [error, setError] = useState(null);
	const [expandedTenderId, setExpandedTenderId] = useState(null);
	const [sortField, setSortField] = useState("creation_date");
	const navigate = useNavigate();
	const role = localStorage.getItem("userType");

	const fetchTenders = useCallback(async (page, sort) => {
		setLoading(true);
		try {
			const tenderData = await get(`/api/tenders?page=${page}&sort=${sort}`);
			const bidsData = await get("/api/bidder-bid?page=1");

			setTenders(tenderData.results);
			setBids(bidsData.results);
			setPagination(tenderData.pagination);
			setError(null);
		} catch (error) {
			setError("Error fetching tenders: " + error.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchTenders(pagination.currentPage, sortField);
	}, [fetchTenders, pagination.currentPage, sortField]);

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

	const handleTenderClick = (id) => {
		setExpandedTenderId((prevId) => (prevId === id ? null : id));
	};

	const truncateText = (text, limit) => {
		if (text.length <= limit) {
			return text;
		}
		return text.substring(0, limit) + "...";
	};

	const hasSubmittedBid = (tenderId) => {
		return bids.some(
			(bid) =>
				bid.tender_id === tenderId &&
				bid.status !== "Withdrawn" &&
				role === "bidder"
		);
	};

	const handleSortChange = (event) => {
		setSortField(event.target.value);
		setPagination((prevPagination) => ({
			...prevPagination,
			currentPage: 1,
		}));
	};

	return (
		<div className="container">
			{error && <p className="error-message">{error}</p>}
			<div className="form-label sort-controls">
				<label htmlFor="sort">Sort by:</label>
				<select
					id="sort"
					className="form-input sort"
					value={sortField}
					onChange={handleSortChange}
				>
					<option value="creation_date">Creation Date</option>
					<option value="closing_date">Closing Date</option>
					<option value="deadline">Project Deadline Date</option>
				</select>
			</div>
			{tenders.length === 0 ? (
				<div className="msg">You do not have any tenders!</div>
			) : (
				tenders.map((tender) => (
					<div className="card" key={tender.tender_id}>
						<p className="posted-on">
							ID:<span className="posted-on-date"> {tender.id}</span>
							<span data-status={tender.status} className="bid-status">
								{tender.status}
							</span>
						</p>
						<h2 className="title">{tender.title}</h2>
						<h5>{tender.company}</h5>
						<div className="details">
							<p>
								<strong>Creation Date: </strong>
								{new Date(tender.creation_date).toLocaleDateString()}
							</p>
							<p>
								<strong>Announcement Date: </strong>
								{new Date(tender.announcement_date).toLocaleDateString()}
							</p>
							<p>
								<strong>Deadline Date: </strong>
								{new Date(tender.deadline).toLocaleDateString()}
							</p>
							<p>
								<strong>Closing Date: </strong>
								{new Date(tender.closing_date).toLocaleDateString()}
							</p>
						</div>
						<h4>Description: </h4>
						<p className="cover-letter">
							{expandedTenderId === tender.id ? (
								<p>
									{tender.description || "No description available"}
									<button
										className="toggle-text"
										onClick={() => handleTenderClick(tender.id)}
										aria-expanded={expandedTenderId === tender.id}
										aria-controls={`description-${tender.id}`}
									>
										Read less
									</button>
								</p>
							) : (
								<p>
									{truncateText(
										tender.description || "No description available",
										150
									)}
									{(tender.description || "").length > 30 && (
										<button
											className="toggle-text"
											onClick={() => handleTenderClick(tender.id)}
											aria-expanded={expandedTenderId === tender.id}
											aria-controls={`description-${tender.id}`}
										>
											Read More
										</button>
									)}
								</p>
							)}
						</p>
						<div className="flex">
							<p
								className={
									role === "bidder" ? "showSubmitButton" : "hideSubmitButton"
								}
							>
								{hasSubmittedBid(tender.id) ? (
									<p disabled>Bid Submitted</p>
								) : (
									<Link className="btn" to={`/tenders/${tender.id}/submit-bid`}>
										Submit Bid
									</Link>
								)}
							</p>
							<p className="right last-update">
								Updated on: {new Date(tender.last_update).toLocaleDateString()}
							</p>
						</div>
					</div>
				))
			)}
			{loading && <p>Loading...</p>}
			<div className="pagination-buttons">
				{pagination.currentPage > 1 && (
					<button className="btn" onClick={loadPreviousPage} disabled={loading}>
						Previous Page
					</button>
				)}
				{pagination.currentPage < pagination.totalPages && (
					<button className="btn" onClick={loadNextPage} disabled={loading}>
						Next Page
					</button>
				)}
			</div>
		</div>
	);
};

export default TendersList;
