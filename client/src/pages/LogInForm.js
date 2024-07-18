import React, { useState } from "react";
import { Link } from "react-router-dom";

function LogInForm() {
	const [emailInput, setEmailInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");

	// This variable handles shows success of the request to login with a boolean variable
	const [backEndSuccess, setBackEndSuccess] = useState("");

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
			if (!response.ok) {
				setBackEndSuccess(data.success);
				throw new Error("Network response was not ok");
			} else {
				setBackEndSuccess(data.success);
			}
		} catch (error) {
			setBackEndSuccess(error);
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
				<div>
					<Link to={"/forgot-password"}>I forgot my password</Link>
				</div>
				<div>
					{backEndSuccess && <p>{backEndSuccess}</p>}
					<p>
						Don&apos;t have an account? <Link to={"/signup"}>Sign Up </Link>
					</p>
				</div>
			</div>
		</>
	);
}

export default LogInForm;
