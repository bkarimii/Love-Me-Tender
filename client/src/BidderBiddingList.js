import { useEffect, useState } from "react";
import { get, post } from "./TenderClient";

const BidderBiddingList = () => {
	const [loading, setLoading] = useState(true);
	const [bidderList, setBidderList] = useState([]);
	const [errorMsg, setErrorMsg] = useState(null);

	const fetchBidderBids = async () => {
		try {
			const data = await get("api/bidder-bid?page=1");
			setLoading(false);
			setBidderList(data.results);
		} catch (error) {
			setErrorMsg("Sever Error");
		}
	};

	useEffect(() => {
		fetchBidderBids();
	}, []);

	const handleStatusChange = async (bidId, newStatus) => {
		try {
			setBidderList((prevList) =>
				prevList.map((bid) =>
					bid.bid_id === bidId ? { ...bid, status: newStatus } : bid
				)
			);

			await post(`/api/bid/${bidId}/status`, { status: newStatus });
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

	if (bidderList.length === 0) {
		return <div>No Bidding placed yet!!</div>;
	}

	return (
		<main>
			<h1>Bidder Bidding List</h1>
			<div className="bids-container">
				{" "}
				{bidderList.map((bid, index) => (
					<div className="bid-card" key={index}>
						<p>Status: {bid.status}</p>
						<p>
							submitted on: {new Date(bid.submission_date).toLocaleDateString()}
						</p>
						<p>Bidding Amount: {bid.bidding_amount}</p>
						<div>
							Cover Letter:
							<p>{bid.cover_letter}</p>
						</div>
						<p>Completion Time: {bid.suggested_duration_days}days</p>
						<button onClick={() => handleStatusChange(bid.bid_id, "Withdrawn")}>
							Withdraw
						</button>
					</div>
				))}
			</div>
		</main>
	);
};

export default BidderBiddingList;
