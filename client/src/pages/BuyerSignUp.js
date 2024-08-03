import React, { useState } from "react";
import { post } from "../TenderClient";

function BuyerSignUp() {
	const [buyerDetails, setbuyerDetails] = useState({
		userType: "buyer",
		firstName: "",
		lastName: "",
		email: "",
		company: "",
		address: "",
	});
	// This variable shows success of the request to during sign up that comes back from server
	const [resgisterStatus, setRegisterStatus] = useState("");

	async function postbuyerDetails(userData) {
		try {
			const data = await post("/mock-api", userData);
			if (data.success) {
				setRegisterStatus("Successfully registered.");
			}
			setRegisterStatus("Registration failed!");
		} catch (error) {
			setRegisterStatus("Internal server error");
		}
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setbuyerDetails((prevDetails) => ({
			...prevDetails,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		postbuyerDetails(buyerDetails);
	};

	return (
		<>
			<div>
				<form onSubmit={handleSubmit}>
					<div>
						<label htmlFor="first-name">First Name:</label>
						<input
							type="text"
							id="first-name"
							name="firstName"
							placeholder="Enter your first name"
							value={buyerDetails.firstName}
							onChange={handleInputChange}
							required
						/>
					</div>
					<div>
						<label htmlFor="last-name">Last Name:</label>
						<input
							type="text"
							id="last-name"
							name="lastName"
							placeholder="Enter your last name"
							value={buyerDetails.lastName}
							onChange={handleInputChange}
							required
						/>
					</div>
					<div>
						<label htmlFor="email">Email:</label>
						<input
							type="email"
							id="email"
							name="email"
							placeholder="Enter your email address"
							value={buyerDetails.email}
							onChange={handleInputChange}
							required
						/>
					</div>
					<div>
						<label htmlFor="company">Company:</label>
						<input
							type="text"
							id="company"
							name="company"
							placeholder="Enter your company name"
							value={buyerDetails.company}
							onChange={handleInputChange}
						/>
					</div>
					<div>
						<label htmlFor="address">Address:</label>
						<input
							type="text"
							id="address"
							name="address"
							placeholder="Enter your address"
							value={buyerDetails.address}
							onChange={handleInputChange}
						/>
					</div>
					<button type="submit">Submit</button>
				</form>
			</div>
			<div>
				<p>{resgisterStatus}</p>
			</div>
		</>
	);
}

export default BuyerSignUp;
