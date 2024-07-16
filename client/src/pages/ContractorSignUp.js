import React, { useState } from "react";

function ContractorSignUp(){
	const [contractorDetails, setContractorDetails] = useState({
		userType:"contractor" ,
		firstName: "",
		lastName: "",
		email: "",
		company: "",
		address: "",
		password: "",
		confirmPassword: "",
	});
	const [passwordError, setPasswordError] = useState("");
    const [emailError , setEmailError]=useState("");
    const [passwordMatches, setPasswordMatches] = useState(true);
	// This variable tracks the message comes back from server after posting users details
	const [backEndMessage , setBackendMessage]=useState("");

	// Check if password has the requirements
	const validatePassword = (password) => {
		// Regex to validate password (minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character)
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		return passwordRegex.test(password);
	};

	// This function checks if inputed email is valid
	const validateEmail = (email) => {
		//Regex to check email format is valid
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	//Fetch function to post data to back-end
	async function postContractorDeatils(userData) {
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
				setBackendMessage(data.message || "Something went wrong!");
				throw new Error("Network response was not ok");
			}else{
				setBackendMessage(
					data.message || "Signed up successfully ! please check your emailinbox for activation email.");
			}
		} catch (error) {
			setBackendMessage(error.message);
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

        const handleSubmit=(e)=>{
            e.preventDefault();
						if (
							validateEmail(contractorDetails.email) &&
							validatePassword(contractorDetails.password) &&
							contractorDetails.password === contractorDetails.confirmPassword
						) {
							// If condtions verified clears all the error variables
							setEmailError("");
							setPasswordError("");
							setPasswordMatches(true);
							//Send a fetch post to the server
							postContractorDeatils(contractorDetails);
							console.log("successfully recorded");
						} else {
							//If one of conditions doesn't satisfied
							//If email is not valid
							if (!validateEmail(contractorDetails.email)) {
								setEmailError("Enter a valid email address");
								console.log("Email not valid!");
								//If password is not valid
							} else if (!validatePassword) {
								setPasswordError(
									"Your password  must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character"
								);
								console.log("password requirement error");
							} else if (!passwordMatches) { // if passwords doesn't match
								setPasswordMatches(false);
								console.log("password doesn't match");
							}else{
								console.log("An error happened!");
							}
						}
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
					<div>
						<label htmlFor="password">Password:</label>
						<input
							type="password"
							id="password"
							name="password"
							placeholder="Enter your password"
							value={contractorDetails.password}
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
							value={contractorDetails.confirmPassword}
							onChange={handleInputChange}
							required
						/>
						{!passwordMatches && <p>Password does not match !</p>}
					</div>
					<button type="submit">Submit</button>
				</form>
				{backEndMessage && <p>{backEndMessage}</p>}
			</div>
		</>
	);
}

export default ContractorSignUp;