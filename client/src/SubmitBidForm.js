import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get, post } from "./TenderClient";
import "./SubmitBidForm.css";
import Logo from "./assets/images/CTY-logo-rectangle.png";

const SubmitBidForm = () => {
	const { tenderId } = useParams();
	const [coverLetter, setCoverLetter] = useState("");
	const [proposedDuration, setProposedDuration] = useState("");
	const [proposedBudget, setProposedBudget] = useState("");
	const [errorStatus, setErrorStatus] = useState("");
	const [errors, setErrors] = useState([]);
	const [expandedTenderId, setExpandedTenderId] = useState(null);

	const [tender, setTender] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchTender = async () => {
			try {
				const response = await get(`/api/tenders/${tenderId}`);
				setTender(response.resource);
			} catch (error) {
				setErrors(["An error occurred while fetching tender details."]);
			}
		};

		fetchTender();
	}, [tenderId]);

	const handleCoverLetterChange = (e) => {
		setCoverLetter(e.target.value);
	};

	const handleProposedDurationChange = (e) => {
		setProposedDuration(e.target.value);
	};

	const handleProposedBudgetChange = (e) => {
		setProposedBudget(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (coverLetter.length > 1000) {
			errors.push("Maximum length is upto 1,000 characters");
		}

		const duration = parseInt(proposedDuration);
		if (isNaN(duration) || duration < 1 || duration > 1000) {
			errors.push("Duration must be between 1 and 1,000 days");
		}

		const budget = parseFloat(proposedBudget);
		if (isNaN(budget) || budget <= 0) {
			errors.push("Input a valid bidding amount");
		}

		try {
			const bidData = {
				tenderId,
				bidding_amount: budget,
				cover_letter: coverLetter,
				suggested_duration_days: duration,
				bidding_date: new Date(),
			};

			await post("/api/bid", bidData);
			setErrorStatus(null);
			setErrors([]);
			alert("Bid submitted successfully!");
			navigate("/dashboard");
		} catch (error) {
			const { status, data } = error.response;
			if (status === 400) {
				setErrorStatus("Validation Error");
				setErrors(data.errors || []);
			} else {
				setErrorStatus("Server Error. Try again later.");
				setErrors([]);
			}
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

	return (
		<main className="main">
			<h3 className="msg">Tender Information</h3>

			<div className="container center">
				{tender ? (
					<div className="card">
						<p>
							<strong>Title:</strong> {tender.title}{" "}
							<span data-status={tender.status}>{tender.status}!!</span>
						</p>
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
					</div>
				) : (
					<p>Loading tender details...</p>
				)}
				<div className="form-container submit-form-container">
					<div className="form-logo">
						<img src={Logo} alt="logo" />
					</div>
					<h1 className="form-heading">Submit Bid</h1>
					<form onSubmit={handleSubmit} className="submit-form">
						<div className="form-label">
							<label htmlFor="coverLetter">Cover Letter:</label>
							<textarea
								className="form-input textarea"
								id="coverLetter"
								value={coverLetter}
								onChange={handleCoverLetterChange}
							></textarea>
						</div>
						<div className="submit-form-details">
							<div className="form-label">
								<label htmlFor="proposedDuration">
									Proposed Project Duration (Days):
								</label>
								<input
									className="form-input"
									type="number"
									id="proposedDuration"
									value={proposedDuration}
									onChange={handleProposedDurationChange}
									required
								/>
							</div>
							<div className="form-label">
								<label htmlFor="proposedBudget">
									Proposed Project Budget (£):
								</label>
								<input
									className="form-input"
									type="number"
									id="proposedBudget"
									value={proposedBudget}
									onChange={handleProposedBudgetChange}
									required
								/>
							</div>
						</div>
						<button className="btn" type="submit">
							Submit Bid
						</button>
					</form>
				</div>
				{errorStatus && (
					<div className="message">
						<p>{errorStatus}</p>
						<ul className="error-list">
							{errors.map((error, index) => (
								<li key={index}>{error}</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</main>
	);
};

export default SubmitBidForm;
