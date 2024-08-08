import { useState, useEffect } from "react";
import { get, post } from "./TenderClient";

const BidderBiddingList = () => {
	const [bids, setBids] = useState([]);
	const [errorMsg, setErrorMsg] = useState(null);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const fetchBids = async (page) => {
		setLoading(true);
		try {
			const data = await get(`/api/bidder-bid?page=${page}`);
			setBids(data.results);
			setErrorMsg(null);
			setTotalPages(data.pagination.totalPages);
		} catch (error) {
			setErrorMsg("Error fetching tenders");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBids(currentPage);
	}, [currentPage]);

	const handlePrevious = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};
	const handleNext = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handleStatusChange = async (bidId, newStatus) => {
		try {
			setBids((prevList) =>
				prevList.map((bid) =>
					bid.bid_id === bidId ? { ...bid, status: newStatus } : bid
				)
			);

			await post(`/api/bid/${bidId}/status`, { status: newStatus });
			fetchBids();
		} catch (error) {
			setErrorMsg("Server Error");
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
			<h2 className="msg">My Bidding List</h2>
			<div className="container">
				{errorMsg && <p className="error-message">{errorMsg}</p>}
				{bids.length === 0 ? (
					<div className="msg">You do not have any bids!</div>
				) : (
					bids.map((bid) => (
						<div className="card" key={bid.tender_id}>
							<p className="posted-on">
								Bid ID: <span className="posted-on-date">{bid.bid_id}</span> |
								Tender ID:{" "}
								<span className="posted-on-date">{bid.tender_id}</span>
								<span data-status={bid.status} className="bid-status">
									{bid.status}
								</span>
							</p>
							<h2 className="title">
								<a className="tender-id" href="/">
									{bid.title}
								</a>
							</h2>
							<div className="details">
								<p>
									<strong>Closing Date: </strong>
									{new Date(bid.closing_date).toLocaleDateString()}
								</p>
								<p>
									<strong>Announcement Date: </strong>
									{new Date(bid.announcement_date).toLocaleDateString()}
								</p>
								<p>
									<strong>Submitted on: </strong>
									{new Date(bid.submission_date).toLocaleDateString()}
								</p>
							</div>
							<p>
								<strong>Cost: </strong>£{bid.bidding_amount}{" "}
								<span>
									<strong>Completion Time:</strong>{" "}
									{bid.suggested_duration_days} days
								</span>
							</p>
							{bid.status !== "Withdrawn" && (
								<button
									className="btn withdraw-btn"
									onClick={() => handleStatusChange(bid.bid_id, "Withdrawn")}
								>
									Withdraw
								</button>
							)}
						</div>
					))
				)}

				{loading && <p>Loading...</p>}
				<div className="pagination-buttons">
					{currentPage > 1 && (
						<button onClick={handlePrevious}>Previous</button>
					)}
					{currentPage < totalPages && (
						<button onClick={handleNext}>Next</button>
					)}
				</div>
			</div>
		</main>
	);
};

export default BidderBiddingList;
