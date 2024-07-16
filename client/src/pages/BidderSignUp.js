import React, { useState } from "react";

function BidderSignUp(){
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
    const [passwordMatches , setPasswordMatches]=useState(true);
	// This variable tracks the message comes back from server after posting user details
	const [backEndMessage , setBackEndMessage]=useState("");

	// This function checks if inputed email is valid
	const validateEmail = (email) => {
		//Regex to check email format is valid
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

    // Check if password has the requirements
	const validatePassword = (password) => {
		// Regex to validate password (minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character)
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		return passwordRegex.test(password);
	};

    //Fetch function to post data to back-end
    async function postBidderDeatils(userData) {
			try {
				const response = await fetch("/mock-api", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(userData),
				});
				const data=await response.json();
				if (!response.ok) {
					setBackEndMessage(data.message || "Something went wrong!");
					throw new Error("Network response was not ok");
				}else{
					setBackEndMessage(data.message || "Signed up successfully ! please check your emailinbox for activation email.");
				}
			} catch (error) {
				setBackEndMessage(error.message);
				console.error("Error during signup:", error);
			}
		}

    const handleInputChange = (e) => {
			const { name, value } = e.target;
			setBidderDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
			// Check password validity on change
			if (name === "password") {
				const isValid = validatePassword(value);
				setPasswordError(isValid ? "" : "Your password  must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character"
					);
			}
		};

	if(bidderDetails.password === bidderDetails.confirmPassword){
		setPasswordMatches(true);
	}

    const handleSubmit = (e) => {
        e.preventDefault();
		const isPasswordValid = validatePassword(bidderDetails.password);
		const doPasswordsMatch = bidderDetails.password === bidderDetails.confirmPassword;
		const isEmailValid = validateEmail(bidderDetails.email);

			if (isPasswordValid && isEmailValid && doPasswordsMatch) {
				setEmailError("");
				setPasswordError("");
                setPasswordMatches(true);
				postBidderDeatils(bidderDetails);
			} else {
				if (!validateEmail(bidderDetails.email)) {
					setEmailError("Enter a valid email address");
				} else if (!validatePassword) {
					setPasswordError(
						"Your password  must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character"
					);
				} else if (!passwordMatches) {
                    setPasswordMatches(false);
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
				<div>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						name="password"
						placeholder="Enter your password"
						value={bidderDetails.password}
						onChange={handleInputChange}
						required
					/>
					{passwordError && <p>{passwordError}</p>}
				</div>
				<div>
					<label htmlFor="confirm-password">Confirm Password:</label>
					<input
						type="password"
						id="confirm-password"
						name="confirmPassword"
						placeholder="Confirm your password"
						value={bidderDetails.confirmPassword}
						onChange={handleInputChange}
						required
					/>
					{!passwordMatches && <p>Password does not match !</p>}
				</div>
				<button type="submit">Submit</button>
			</form>
			{backEndMessage && <p>{backEndMessage}</p>}
		</>
	);
}

export default BidderSignUp ;