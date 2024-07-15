/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";

function Bidder(){
	const [bidderDetails, setBidderDetails] = useState({
		userType: "bidder",
		firstName: "",
		lastName: "",
		userName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
    const [emailError , setEmailError]=useState("");
    const [passwordError , setPasswordError]=useState("");

	// This function checks if inputed email is valid
	const validateEmail = (email) => {
		//regex to check email format is valid
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

    // check if password has the requirements
	const validatePassword = (password) => {
		// regex to validate password (minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character)
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		return passwordRegex.test(password);
	};

    
    const handleInputChange = (e) => {
			const { name, value } = e.target;
			setBidderDetails((prevDetails)=>({ ...prevDetails , [name]:value }));
		};


	return (
		<>
			<form>
				<div>
					<label htmlFor="first-name">First Name:</label>
					<input
						type="text"
						id="first-name"
						name="firstName"
						placeholder="Enter your first name"
                        value={bidderDetails.firstName}
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
						required
					/>
				</div>
				<div>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						name="password"
						placeholder="Enter your password"
                        value={bidderDetails.password}
						required
					/>
				</div>
				<div>
					<label htmlFor="confirm-password">Confirm Password:</label>
					<input
						type="password"
						id="confirm-password"
						name="confirmPassword"
						placeholder="Confirm your password"
                        value={bidderDetails.confirmPassword}
						required
					/>
				</div>
				<button type="submit">Submit</button>
			</form>
		</>
	);
}