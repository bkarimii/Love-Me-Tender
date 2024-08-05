import { useState } from "react";
import "./GrantAccessForm.css";
import { post } from "../TenderClient";
import Logo from "../assets/images/CTY-logo-rectangle.png";

const GrantAccessForm = () => {
	const [role, setRole] = useState("bidder");
	const [buyerDetails, setBuyerDetails] = useState({
		userType: "buyer",
		company: "",
		description: "",
		address: "",
		email: "",
	});

	const [bidderDetails, setBidderDetails] = useState({
		userType: "bidder",
		firstName: "",
		lastName: "",
		email: "",
	});

	const [resgisterStatus, setRegisterStatus] = useState("");
	const [validationErrors, setValidationErrors] = useState([]);

	async function postDetails(endpoint, data) {
		try {
			await post(endpoint, data);
			setRegisterStatus("Successfully registered.");
			setValidationErrors([]);
		} catch (error) {
			const { status, data } = error.response;

			if (status === 400) {
				setRegisterStatus("Validation error");
				setValidationErrors(data.errors || []);
			} else {
				setRegisterStatus("A server error occurred. Please try again later.");
				setValidationErrors([]);
			}
		}
	}

	const handleBidderChange = (e) => {
		const { name, value } = e.target;
		setBidderDetails((prevDetails) => ({
			...prevDetails,
			[name]: value,
		}));
	};

	const handleBuyerChange = (e) => {
		const { name, value } = e.target;
		setBuyerDetails((prevDetails) => ({
			...prevDetails,
			[name]: value,
		}));
	};
	const handleBuyerSubmit = (e) => {
		e.preventDefault();
		postDetails("/api/signup", buyerDetails);
	};

	const handleBidderSubmit = (e) => {
		e.preventDefault();
		postDetails("/api/signup", bidderDetails);
	};

	return (
		<main className="main">
			<div className="container-role" onChange={(e) => setRole(e.target.value)}>
				<label htmlFor="role">Select a role</label>
				<select className="form-input" name="role">
					<option className="grant-access-option" value="bidder">
						Bidder
					</option>
					<option className="grant-access-option" value="buyer">
						Buyer
					</option>
				</select>
			</div>

			{role === "bidder" && (
				<div className="form-container">
					<div className="form-logo">
						<img src={Logo} alt="logo" />
					</div>
					<h1 className="form-heading">Register Bidder</h1>
					<form className="form" onSubmit={handleBidderSubmit}>
						<div className="form-label">
							<label htmlFor="first-name">First Name</label>
							<input
								className="form-input"
								type="text"
								name="firstName"
								placeholder="Enter your first name"
								value={bidderDetails.firstName}
								onChange={handleBidderChange}
								required
							/>
						</div>
						<div className="form-label">
							<label htmlFor="first-name">Last Name</label>
							<input
								className="form-input"
								type="text"
								name="lastName"
								placeholder="Enter your Last name"
								value={bidderDetails.lastName}
								onChange={handleBidderChange}
								required
							/>
						</div>
						<div className="form-label">
							<label htmlFor="email">Email</label>
							<input
								className="form-input"
								type="email"
								name="email"
								placeholder="Enter your email address"
								value={bidderDetails.email}
								onChange={handleBidderChange}
								required
							/>
						</div>
						<button className="form-btn grant-access-btn" type="submit">
							Submit
						</button>
					</form>
				</div>
			)}

			{role === "buyer" && (
				<div className="form-container buyer-container">
					<div className="form-logo">
						<img src={Logo} alt="logo" />
					</div>
					<h1 className="form-heading">Register Buyer</h1>
					<form className="form buyer-form" onSubmit={handleBuyerSubmit}>
						<div className="form-label">
							<label htmlFor="company">Company</label>
							<input
								className="form-input"
								type="text"
								id="company"
								name="company"
								placeholder="Enter your company name"
								value={buyerDetails.company}
								onChange={handleBuyerChange}
							/>
						</div>

						<div className="form-label description">
							<label htmlFor="description">Description</label>
							<textarea
								className="form-input textarea"
								type="text"
								id="description"
								name="description"
								placeholder="Enter your description"
								value={buyerDetails.description}
								onChange={handleBuyerChange}
							/>
						</div>
						<div className="form-label">
							<label htmlFor="email">Email</label>
							<input
								className="form-input"
								type="email"
								id="email"
								name="email"
								placeholder="Enter your email address"
								value={buyerDetails.email}
								onChange={handleBuyerChange}
								required
							/>
						</div>

						<div className="form-label">
							<label htmlFor="address">Address</label>
							<input
								className="form-input"
								type="text"
								id="address"
								name="address"
								placeholder="Enter your address"
								value={buyerDetails.address}
								onChange={handleBuyerChange}
							/>
						</div>
						<button className="form-btn grant-access-btn" type="submit">
							Submit
						</button>
					</form>
				</div>
			)}
			{resgisterStatus && (
				<div className="message">
					<p>{resgisterStatus}</p>
					<ul className="error-list">
						{validationErrors.map((error, index) => (
							<li key={index}>{error}</li>
						))}
					</ul>
				</div>
			)}
		</main>
	);
};

export default GrantAccessForm;
