import React, { useState } from "react";

function BidderSignUp() {
	const [bidderDetails, setBidderDetails] = useState({
		userType: "bidder",
		firstName: "",
		lastName: "",
		userName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [emailError, setEmailError] = useState("");
	const [backEndSuccess, setBackEndSuccess] = useState(null);

	const validateEmail = (email) => {
		//Regex to check email format is valid
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	async function postBidderDeatils(userData) {
		try {
			const response = await fetch("/mock-api", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});
			const data = await response.json();
			if (!response.ok) {
				throw new Error("Network response was not ok");
			} else {
				setBackEndSuccess(data.success);
			}
		} catch (error) {
			setBackEndSuccess(false);
		}
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setBidderDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const isEmailValid = validateEmail(bidderDetails.email);
		if (isEmailValid) {
			setEmailError("");
			postBidderDeatils(bidderDetails);
		} else {
			if (!validateEmail(bidderDetails.email)) {
				setEmailError("Enter a valid email address");
			}
		}
	};

	return (
		<>
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
					{emailError && <p>{emailError}</p>}
				</div>
				<button type="submit">Submit</button>
			</form>
			{backEndSuccess && <p>Registeration was successfull</p>}
		</>
	);
}

export default BidderSignUp;
