import { useEffect, useState } from "react";
import { get } from "./TenderClient";

const BidderBiddingList = () => {
	const [loading, setLoading] = useState(true);
	const [bidderList, setBidderList] = useState([]);
	const [errorMsg, setErrorMsg] = useState(null);

	useEffect(() => {
		const fetchBidderBids = async () => {
			try {
				const data = await get("api/bidder-bid?page=1");
				setLoading(false);
				setBidderList(data.results);
			} catch (error) {
				setErrorMsg(error.message);
			}
		};
		fetchBidderBids();
	}, []);

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
					</div>
				))}
			</div>
		</main>
	);
};

export default BidderBiddingList;
