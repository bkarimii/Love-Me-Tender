/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";

function LogInForm(){
    const [emailInput , setEmailInput]=useState("");
    const [passwordInput , setPasswordInput]=useState("") ;
    const [emailError , setEmailError]=useState("") ;
    const [passwordError , setPasswordError]=useState("");
    

    //record changes for email address input
    const handleEmailChange = (e) => {
			const email = e.target.value; 
			setEmailInput(email); 
		};

    //record changes on password input
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

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				console.log("User signed up successfully!");
			} catch (error) {
				console.error("Error during signup:", error);
			}
		}
    const handleFormSubmit = (e) => {
			e.preventDefault(); // Prevents the default form submission
			const logInData={ emailInput , passwordInput };


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
						{emailError && <span>{emailError}</span>}
						<label htmlFor="password">Password:</label>
						<input
							type="password"
							id="password"
							name="password"
							value={passwordInput}
							onChange={handlePasswordChange}
							required
						/>
						{passwordError && <span>{passwordError}</span>}
						<button type="submit">Log In</button>
					</form>
                    <div><Link to={"/forgot-password"} >I forgot my password</Link></div>
					<div>
						<p>
							Don&apos;t have an account? <Link to={"/signup"} >Sign Up </Link >
						</p>
					</div>
				</div>
			</>
		);
}

export default LogInForm ;