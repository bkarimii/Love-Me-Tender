import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get, post } from "./TenderClient";
import "./BidList.css";

const BidList = () => {
	const { pageNumber, tenderId } = useParams();
	const currentPage = pageNumber ? parseInt(pageNumber, 10) : 1;
	const [bids, setBids] = useState([]);
	const [tender, setTender] = useState(null);
	const [updateStatus, setUpdatedStatus] = useState("");
	const [errorMsg, setErrorMsg] = useState(null);
	const [statusError, setStatusError] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const [pagination, setPagination] = useState({
		itemsPerPage: 10,
		currentPage: currentPage,
		totalPages: 1,
	});

	const fetchData = useCallback(async () => {
		setLoading(true);
		try {
			const tenderData = await get(`/api/tenders/${tenderId}`);
			setTender(tenderData.resource);

			const bidsData = await get(
				`/api/bid?tender_id=${tenderId}&page=${currentPage}`
			);
			setBids(bidsData.results);
			setPagination(bidsData.pagination);

			setErrorMsg(null);
		} catch (error) {
			setErrorMsg("Error fetching data!");
		} finally {
			setLoading(false);
		}
	}, [tenderId, currentPage]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleBidStatusChange = async (bidId, status) => {
		try {
			await post(`/api/bid/${bidId}/status`, { status });
			setUpdatedStatus(`Updated the status for bid id ${bidId} to ${status}!`);
			await fetchData();
		} catch (error) {
			setStatusError("An error occurred while updating bid status!");
		}
	};

	const handleRejectBid = async (bidId) => {
		const confirmation = window.confirm(
			"Are you sure you want to Reject this bid ?"
		);
		if (!confirmation) {
			return;
		}
		await handleBidStatusChange(bidId, "Rejected");
	};

	const handleAcceptBid = async (bidId) => {
		const confirmation = window.confirm(
			"Are you sure you want to Award this bid ?"
		);
		if (!confirmation) {
			return;
		}
		await handleBidStatusChange(bidId, "Awarded");
	};

	const handleTenderStatusChange = async (tenderId, status) => {
		try {
			await post(`/api/tender/${tenderId}/status`, { status });
			setUpdatedStatus(
				`Updated the status for tender ${tenderId} to ${status}!`
			);
			await fetchData();
		} catch (error) {
			setStatusError("An error occurred while updating tender status!");
		}
	};

	const handleInReviewStatus = async (tenderId) => {
		const confirmation = window.confirm(
			"Are you sure you want to change the tender status to in review ?"
		);
		if (!confirmation) {
			return;
		}
		await handleTenderStatusChange(tenderId, "In Review");
	};
	const handleCancelStatus = async (tenderId) => {
		const confirmation = window.confirm(
			"Are you sure you want to cancel the tender ?"
		);
		if (!confirmation) {
			return;
		}
		await handleTenderStatusChange(tenderId, "Cancelled");
	};

	const loadNextPage = () => {
		if (pagination.currentPage < pagination.totalPages && !loading) {
			navigate(`/bidding/${tenderId}/page/${pagination.currentPage + 1}`);
		}
	};

	const loadPreviousPage = () => {
		if (pagination.currentPage > 1 && !loading) {
			navigate(`/bidding/${tenderId}/page/${pagination.currentPage - 1}`);
		}
	};

	setTimeout(() => {
		setUpdatedStatus("");
	}, 10000);

	if (errorMsg) {
		return <div className="msg">{errorMsg}</div>;
	}
	if (loading) {
		return <div className="msg">Loading...</div>;
	}
	if (statusError) {
		return <div className="msg">{statusError}</div>;
	}

	return (
		<main className=".main">
			<h2 className="heading">Tender Details</h2>
			<div className="container">
				{updateStatus && <div className="message">{updateStatus}</div>}
				<div className="card">
					<span className="posted-on-date">
						{" "}
						Posted on: {new Date(tender.creation_date).toLocaleDateString()}
					</span>
					<span data-status={tender.status}>{tender.status}</span>
					<h2>{`Tender ID: ${tender.id} - Tender Title: ${tender.title}`}</h2>
					<div className="flex">
						<p>
							<strong>Closing Date: </strong>
							{new Date(tender.closing_date).toLocaleDateString()}
						</p>
						<p>
							<strong>Announcement Date: </strong>
							{new Date(tender.announcement_date).toLocaleDateString()}
						</p>
						<p>
							<strong>Project Deadline Date: </strong>
							{new Date(tender.deadline).toLocaleDateString()}
						</p>
					</div>
					<h3>Description: </h3>
					<p className="cover-letter">{tender.description}</p>
					<p>
						<strong>Number of Bids: </strong>
						{tender.no_of_bids_received}
					</p>
					<p className="last-update right">
						<strong>Last Update: </strong>
						{new Date(tender.last_update).toLocaleString()}
					</p>
					<div className="btn-container">
						{tender.status === "Active" && (
							<>
								<button
									className="btn"
									onClick={() => handleInReviewStatus(tender.id)}
								>
									In Review
								</button>
								<button
									className="btn"
									onClick={() => handleCancelStatus(tender.id)}
								>
									Cancel
								</button>
							</>
						)}
						{tender.status === "In Review" && (
							<button
								className="btn"
								onClick={() => handleCancelStatus(tender.id)}
							>
								Cancel
							</button>
						)}
					</div>
				</div>
			</div>
			<h2 className="heading">Bids</h2>
			<div className="container">
				{bids.length === 0 ? (
					<div className="msg">No Bid Submitted yet!</div>
				) : (
					bids.map((bid) => (
						<div className="card" key={bid.bid_id}>
							<p className="posted-on">
								Submitted on
								<span className="posted-on-date">
									{new Date(bid.bidding_date).toLocaleDateString()}
								</span>
								<span data-status={bid.status} className="bid-status">
									{bid.status}
								</span>
							</p>
							<p className="title">
								<strong>Bidder Id:</strong> {bid.bidder_id} |{" "}
								<strong>Bidder Name: </strong>
								{bid.first_name + " " + bid.last_name}
							</p>
							<p>
								<strong>Proposed Project Duration: </strong>
								{bid.suggested_duration_days} days |{" "}
								<strong>Proposed Project Budget: </strong>£ {bid.bidding_amount}
							</p>
							{bid.cover_letter && (
								<div>
									<h4>Cover letter:</h4>
									<p className="cover-letter"> {bid.cover_letter}</p>
								</div>
							)}
							<div className="btn-container">
								{bid.status !== "Rejected" && bid.status !== "Awarded" && (
									<>
										<button
											className="btn"
											onClick={() => handleAcceptBid(bid.bid_id)}
										>
											Accept
										</button>
										<button
											className="btn"
											onClick={() => handleRejectBid(bid.bid_id)}
										>
											Reject
										</button>
									</>
								)}
							</div>
						</div>
					))
				)}
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

export default BidList;
