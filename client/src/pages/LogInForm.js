/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";

function LogInForm(){
    const [emailInput , setEmailInput]=useState("");
    const [passwordInput , setPasswordInput]=useState("") ;
    const [emailError , setEmailError]=useState("") ;
    const [passwordError , setPasswordError]=useState("");
    

    // This function checks if inputed email is valid
    const validateEmail=(email)=>{
        //regex to check email format is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    } ;
    
    const validatePassword=(password)=>{
			// regex to validate password (minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character)
			const passwordRegex =
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
			return passwordRegex.test(password);
		};

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

    
    const handleFormSubmit = (e) => {
			e.preventDefault(); // Prevents the default form submission

			// Validate email and password
			if (validateEmail(emailInput) && validatePassword(passwordInput)) {
				// Clear any existing error messages
				setEmailError("");
				setPasswordError("");

				
				console.log("Email:", emailInput);
				console.log("Password:", passwordInput);
			} else {
				// Check specific validation errors
				if (!validateEmail(emailInput)) {
					setEmailError("Please enter a valid email address.");
				} else {
					setEmailError("");
				}

				if (!validatePassword(passwordInput)) {
					setPasswordError(
						"Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character."
					);
				} else {
					setPasswordError("");
				}
			}
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