import React, { useState } from "react";
import { Link } from "react-router-dom";

function LogInForm(){
    const [emailInput , setEmailInput]=useState("");
    const [passwordInput , setPasswordInput]=useState("") ;

	//This Variable handle any error comes back from server to display it
	const [backEndMessage , setBackEndMessage]=useState("");

    //Record changes for email address input
    const handleEmailChange = (e) => {
			const email = e.target.value;
			setEmailInput(email);
		};

    //Record changes on password input
    const handlePasswordChange=(e)=>{
        const password=e.target.value;
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
				const data=await response.json();
				if (!response.ok) {
					setBackEndMessage(data.message || "Something went wrong! Try again.");
					throw new Error("Network response was not ok");
				}else{
					setBackEndMessage(data.message || "User signed up successfully!");
				}
			} catch (error) {
				console.error("Error during signup:", error);
				setBackEndMessage(error.message);
			}
		}
    const handleFormSubmit = (e) => {
			e.preventDefault(); // Prevents the default form submission
			const logInData={ email: emailInput ,password: passwordInput };


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
						{backEndMessage && <p>{backEndMessage}</p>}
						<p>
							Don&apos;t have an account? <Link to={"/signup"}>Sign Up </Link>
						</p>
					</div>
				</div>
			</>
		);
}

export default LogInForm ;