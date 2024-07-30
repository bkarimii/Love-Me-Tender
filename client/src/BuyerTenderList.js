import { useEffect, useState } from "react";

const BuyerTenderList = () => {
	const [loading, setLoading] = useState(true);
	const [buyerTenders, setBuyerTenders] = useState([]);
	const [errorMsg, setErrorMsg] = useState(null);

	function dateFormat(date) {
		return date.split("T")[0];
	}

	useEffect(() => {
		const fetchBuyerTenders = async () => {
			try {
				const response = await fetch("api/buyer-tender?page=1");
				if (!response.ok) {
					throw new Error("Problem with the server!");
				}
				const data = await response.json();
				setLoading(false);
				setBuyerTenders(data.results);
			} catch (error) {
				setErrorMsg(error.message);
			}
		};
		fetchBuyerTenders();
	}, []);

	if (errorMsg !== null) {
		return <div>{errorMsg}</div>;
	}

	if (loading) {
		return <div>Loading!!</div>;
	}

	if (buyerTenders.length === 0) {
		return <div>No tender published yet!!</div>;
	}

	return (
		<main>
			<h1>Buyer Tenders List</h1>
			<div className="tender-container">
				{" "}
				{buyerTenders.map((tender, index) => (
					<div className="tender-card" key={index}>
						<a href="/" className="tender-title">
							{tender.title}
						</a>
						<p>Tender created on: {dateFormat(tender.creation_date)}</p>
						<div>
							<p>Announcement Date: {dateFormat(tender.announcement_date)}</p>
							<p>Deadline: {dateFormat(tender.deadline)}</p>{" "}
						</div>
						<p className="tender-description">
							{tender.description.substring(0, 200)}
						</p>
						<p>No of bids: {tender.no_of_bids_recevied}</p>
						<p>Cost £{tender.cost}</p>
						<span>Status {tender.status}</span>
						<span>Last Update: {dateFormat(tender.last_update)}</span>
					</div>
				))}
			</div>
		</main>
	);
};

export default BuyerTenderList;
