import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get, post } from "./TenderClient";
import "./BidList.css";

const BuyerTenderList = () => {
	const { pageNumber } = useParams();
	const { tenderId } = useParams();
	const currentPage = pageNumber ? parseInt(pageNumber, 10) : 1;
	const [bids, setBids] = useState([]);
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

	const fetchBids = async (tenderId, page) => {
		setLoading(true);
		try {
			const data = await get(`/api/bid?tender_id=${tenderId}&page=${page}`);
			setBids(data.results);
			setPagination(data.pagination);
			setErrorMsg(null);
		} catch (error) {
			setErrorMsg("Error fetching bids!");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBids(tenderId, currentPage);
	}, [currentPage, tenderId]);

	const handleBidStatusChange = async (bidId, status) => {
		try {
			await post(`/api/bid/${bidId}/status`, { status });
			setUpdatedStatus(`Updated the status for bid id ${bidId} to ${status}!`);
			fetchBids(tenderId, currentPage);
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
			{updateStatus && <div className="message">{updateStatus}</div>}
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
								<span className="bid-status">{bid.status}</span>
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

export default BuyerTenderList;
