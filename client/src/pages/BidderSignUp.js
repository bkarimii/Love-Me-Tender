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

    //fetch function to post data to back-end
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
					throw new Error("Network response was not ok");
				}

				console.log("User signed up successfully!");
				
			} catch (error) {
				console.error("Error during signup:", error);
				
			}
		}

    const handleInputChange = (e) => {
			const { name, value } = e.target;
			setBidderDetails((prevDetails)=>({ ...prevDetails , [name]:value }));
		};

    const handleSubmit = (e) => {
			const passwordsMatches =
				bidderDetails.password === bidderDetails.confirmPassword;
			if (
				validateEmail(bidderDetails.email) &&
				validatePassword(bidderDetails.password) &&
				passwordsMatches
			) {
                setEmailError("");
                setPasswordError("");
                postBidderDeatils(bidderDetails);
                console.log("successfully recorded");
			}else{
                if(!validateEmail(bidderDetails.email)){
                    setEmailError("Enter a valid email address");
                    console.log("Email not valid!");
                }else if(!validatePassword){
                    setPasswordError(
											"Your password  must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character"
										);
                    console.log("password requirement error");
                }else if(!passwordsMatches){
                    setPasswordError("passwords doesn't match!");
                    console.log("password doesn't match");
                }
            }
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