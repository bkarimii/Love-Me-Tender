import React, { useState } from "react";

function LogInForm() {
	const [emailInput, setEmailInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");
	const [successfulLogIn, setSuccessfulLogIn] = useState("");

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
			const response = await fetch("/mock-api", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});
			const data = await response.json();
			if (response.ok) {
				setSuccessfulLogIn("You're loggedIn now!");
			} else {
				setSuccessfulLogIn("logIn failed!");
			}
		} catch (error) {
			setSuccessfulLogIn("An error happened");
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
			{successfulLogIn && <p>{successfulLogIn}</p>}
		</>
	);
}

export default LogInForm;
