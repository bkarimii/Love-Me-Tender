import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get } from "./TenderClient";

const BidDetail = () => {
	const [bid, setBid] = useState({});
	const [errorMsg, setErrorMsg] = useState(null);
	const [loading, setLoading] = useState(true);
	const { bidId } = useParams();

	useEffect(() => {
		const fetchBid = async () => {
			setLoading(true);
			try {
				const data = await get(`/api/bid/${bidId}`);
				setBid(data.resource);
				setErrorMsg(null);
			} catch (error) {
				setErrorMsg("Error fetching bid");
			} finally {
				setLoading(false);
			}
		};

		fetchBid();
	}, [bidId]);

	if (errorMsg !== null) {
		return <div>{errorMsg}</div>;
	}

	if (loading) {
		return <div>Loading!!</div>;
	}

	return (
		<main>
			<h2 className="msg">Bid Detail</h2>
			<div className="container">
				<div className="card" key={bid.tender_id}>
					<p className="posted-on">
						Bid ID: <span className="posted-on-date">{bid.bid_id}</span> |
						Tender ID: <span className="posted-on-date">{bid.tender_id}</span>
						<span data-status={bid.status} className="bid-status">
							{bid.status}
						</span>
					</p>
					<h2 className="title">
						<a className="tender-id" href={`/bid-detail/${bid.bid_id}`}>
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
							<strong>Completion Time:</strong> {bid.suggested_duration_days}{" "}
							days
						</span>
					</p>

					<div className="bid-description">
						<h3>Description: </h3>
						<p>{bid.description}</p>
					</div>

					{bid.cover_letter && (
						<div className="cover-letter">
							<h3>Cover Letter: </h3>
							<p>{bid.cover_letter}</p>
						</div>
					)}
				</div>
			</div>
		</main>
	);
};

export default BidDetail;
