import React, { useState } from "react";

function BidderSignUp() {
	const [bidderDetails, setBidderDetails] = useState({
		userType: "bidder",
		firstName: "",
		lastName: "",
		userName: "",
		email: "",
	});

	const [registerStatus, setRegisterStatus] = useState("");

	async function postBidderDeatils(userData) {
		try {
			const response = await fetch("/mock-api", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});
			if (!response.ok) {
				setRegisterStatus("Registration failed!");
			}
			setRegisterStatus("Registered successfully!");
		} catch (error) {
			setRegisterStatus("Internal server error!");
		}
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setBidderDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		postBidderDeatils(bidderDetails);
	};

	return (
		<main>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="first-name">First Name:</label>
					<input
						type="text"
						id="first-name"
						name="firstName"
						placeholder="Enter your first name"
						value={bidderDetails.firstName}
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
						value={bidderDetails.lastName}
						onChange={handleInputChange}
						required
					/>
				</div>
				<div>
					<label htmlFor="user-name">Username:</label>
					<input
						type="text"
						id="user-name"
						name="userName"
						placeholder="Enter your username"
						value={bidderDetails.userName}
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
						value={bidderDetails.email}
						onChange={handleInputChange}
						required
					/>
				</div>
				<button type="submit">Submit</button>
			</form>
			<div>{registerStatus}</div>
		</main>
	);
}

export default BidderSignUp;
