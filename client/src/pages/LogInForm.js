/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";

function LogInForm(){
    const [emailInput , setEmailInput]=useState("");
    const [passwordInput , setPasswordInput]=useState("") ;

    // This function checks if inputed email is valid
    const validateEmail=(email)=>{
        //regex to check email format is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    } ;
    


    return (
			<>
				<div>
					<form>
						<label htmlFor="email">E-mail:</label>
						<input type="email" id="email" name="email" required value={emailInput} />
						<label htmlFor="password">Password:</label>
						<input type="password" id="password" name="password" required value={passwordInput} />
						<button type="submit">Log In</button>
					</form>
				</div>
			</>
		);
}

export default LogInForm ;