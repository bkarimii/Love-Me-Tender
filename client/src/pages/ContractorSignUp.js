/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";

function ContractorSignUp(){
	const [contractorDetails, setContractorDetails] = useState({
		firstName: "",
		lastName: "",
		email: "",
		company: "",
		address: "",
		password: "",
		confirmPassword: "",
	});
	const [passwordError, setPasswordError] = useState("");

	// check if password has the requirements
	const validatePassword = (password) => {
		// regex to validate password (minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character)
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		return passwordRegex.test(password);
	};

	// This function checks if inputed email is valid
	const validateEmail = (email) => {
		//regex to check email format is valid
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	//fetch function to post data to back-end
	async function postContractorDeatils(userData) {
		try {
			const response = await fetch("/mock-api", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			console.log("User signed up successfully!");
		} catch (error) {
			console.error("Error during signup:", error);
		}
	}

    const handleInputChange = (e) => {
			const { name, value } = e.target;
			setContractorDetails((prevDetails) => ({
				...prevDetails,
				[name]: value,
			}));
			// Check password validity on change
			if (name === "password") {
				const isValid = validatePassword(value);
				setPasswordError(
					isValid
						? ""
						: "Your password  must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character"
				);
			}
		};


	return (
		<>
			<div>
				<form onSubmit={handleSubmit}>
					<div>
						<label htmlFor="company">Company:</label>
						<input
							type="text"
							id="company"
							name="company"
							placeholder="Enter your company name"
							value={contractorDetails.company}
							onChange={handleInputChange}
							required
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
							required
						/>
					</div>
					{/* ... other form elements */}
					<button type="submit">Submit</button>
				</form>
			</div>
		</>
	);
}

export default ContractorSignUp;