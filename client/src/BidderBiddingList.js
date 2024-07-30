import { useEffect, useState } from "react";

const BidderBiddingList = () => {
	const [loading, setLoading] = useState(true);
	const [bidderList, setBidderList] = useState([]);
	const [errorMsg, setErrorMsg] = useState(null);

	function dateFormat(date) {
		return date.split("T")[0];
	}

	useEffect(() => {
		const fetchBidderBids = async () => {
			try {
				const response = await fetch("api/bidder-bid?page=1");
				if (!response.ok) {
					throw new Error("Problem with the server!");
				}
				const data = await response.json();
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
						<p>submitted on: {dateFormat(bid.bidding_date)}</p>
						<p>Bidding Amount: {bid.bidding_amount}</p>
						<div>
							Cover Letter:
							<p>{bid.cover_letter}</p>
						</div>
						<p>Completion Time: {bid.suggested_duration_days} days</p>
					</div>
				))}
			</div>
		</main>
	);
};

export default BidderBiddingList;
