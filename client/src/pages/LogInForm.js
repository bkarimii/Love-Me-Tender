import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/CTY-logo-rectangle.png";
import { post } from "../TenderClient";
import "./LogInForm.css";

function LogInForm() {
	const [emailInput, setEmailInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

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
			const data = await post("/api/sign-in", userData);
			const { token, user_type } = data.resource;

			localStorage.setItem("authToken", token);
			localStorage.setItem("userType", user_type);
			window.dispatchEvent(new Event("storage"));

			switch (user_type) {
				case "admin":
					navigate("/admin-dashboard");
					break;
				case "buyer":
					navigate("/buyer-dashboard");
					break;
				default:
					navigate("/bidder-dashboard");
			}
		} catch (error) {
			switch (error.status) {
				case 401:
					setErrorMessage("Incorrect password or email.");
					break;
				case 500:
					setErrorMessage("Internal server error. Please try again later.");
					break;
				default:
					setErrorMessage("An error occurred. Please try again.");
			}
		}
	}

	const handleFormSubmit = (e) => {
		e.preventDefault();
		const logInData = { email: emailInput, password: passwordInput };
		postLogInDeatils(logInData);
	};

	return (
		<main>
			<div className="form-container">
				<div className="form-logo">
					<img src={Logo} alt="logo" />
				</div>
				<h5 className="form-heading">Log in </h5>
				<form onSubmit={handleFormSubmit} className="form">
					<label htmlFor="email" className="form-label">
						Email
						<input
							className="form-input"
							type="email"
							id="email"
							name="email"
							placeholder="Value"
							value={emailInput}
							onChange={handleEmailChange}
							required
						/>
					</label>

					<label htmlFor="password" className="form-label">
						Password
						<input
							className="form-input"
							type="password"
							id="password"
							name="password"
							placeholder="Value"
							value={passwordInput}
							onChange={handlePasswordChange}
							required
						/>
					</label>
					<p className="error-message">{errorMessage}</p>
					<button className="form-btn" type="submit">
						Sign In
					</button>
				</form>
			</div>
		</main>
	);
}

export default LogInForm;
