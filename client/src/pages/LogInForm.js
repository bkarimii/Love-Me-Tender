import React, { useState } from "react";
import { Navigate } from "react-router-dom";

function LogInForm() {
	const [emailInput, setEmailInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const handleEmailChange = (e) => {
		const email = e.target.value;
		setEmailInput(email);
	};

	const handlePasswordChange = (e) => {
		const password = e.target.value;
		setPasswordInput(password);
	};

	async function postLogInDeatils(userData) {
		try {
			const response = await fetch("/api/sign-in", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});
			const data = await response.json();
			if (response.ok) {
				const token = data.resources.token;
				localStorage.setItem("authToken", token);
				setErrorMessage("successfull");
				Navigate("/admin-dashboard");
			} else {
				switch (response.status) {
					case 401:
						errorMessage("Incorrect password or email.");
						break;
					case 500:
						errorMessage("Internal server error. Please try again later.");
						break;
					default:
						errorMessage("An error occurred. Please try again.");
				}
			}
		} catch (error) {
			setErrorMessage("Unknown Error happened try again later.");
		}
	}

	const handleFormSubmit = (e) => {
		e.preventDefault();
		const logInData = { email: emailInput, password: passwordInput };
		postLogInDeatils(logInData);
	};

	return (
		<>
			<div>
				<form onSubmit={handleFormSubmit}>
					<label htmlFor="email">E-mail:</label>
					<input
						type="email"
						id="email"
						name="email"
						value={emailInput}
						onChange={handleEmailChange}
						required
					/>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						name="password"
						value={passwordInput}
						onChange={handlePasswordChange}
						required
					/>
					<button type="submit">Log In</button>
				</form>
			</div>
			<div>{errorMessage}</div>
		</>
	);
}

export default LogInForm;
