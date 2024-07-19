import React, { useState } from "react";

function ContractorSignUp() {
	const [contractorDetails, setContractorDetails] = useState({
		userType: "contractor",
		firstName: "",
		lastName: "",
		email: "",
		company: "",
		address: "",
	});
	const [emailError, setEmailError] = useState("");
	// This variable shows success of the request to during sign up that comes back from server
	const [resgisterStatus, setRegisterStatus] = useState("");

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	async function postContractorDetails(userData) {
		try {
			const response = await fetch("/mock-api", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});
			const data = response.json();
			if (!response.ok) {
				setRegisterStatus(data.message);
			}
			setRegisterStatus(data.message);
		} catch (error) {
			setRegisterStatus(error.message);
		}
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setContractorDetails((prevDetails) => ({
			...prevDetails,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateEmail(contractorDetails.email)) {
			setEmailError("");
			postContractorDetails(contractorDetails);
		} else {
			if (!validateEmail(contractorDetails.email)) {
				setEmailError("Enter a valid email address");
			}
		}
	};
	function displayMessage(msg) {
		if (msg === "successful") {
			return "registered successfully!";
		} else if (msg === "mismatchPassword") {
			return "passwords do not match";
		} else if (msg === "emailAlreadyExists") {
			return "email exist";
		} else if (msg === "invalidType") {
			return "Password is incorrect!";
		} else if (msg === "serverError") {
			return "Internal server error";
		} else {
			return "Unkown error";
		}
	}

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
							value={contractorDetails.firstName}
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
							value={contractorDetails.lastName}
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
							value={contractorDetails.email}
							onChange={handleInputChange}
							required
						/>
						{emailError && <p>{emailError}</p>}
					</div>
					<div>
						<label htmlFor="company">Company:</label>
						<input
							type="text"
							id="company"
							name="company"
							placeholder="Enter your company name"
							value={contractorDetails.company}
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
							value={contractorDetails.address}
							onChange={handleInputChange}
						/>
					</div>
					<button type="submit">Submit</button>
				</form>
			</div>
			<div>
				<p>{displayMessage(resgisterStatus)}</p>
			</div>
		</>
	);
}

export default ContractorSignUp;
