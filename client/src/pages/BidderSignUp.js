/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";

function Bidder(){
    const [bidderDetails , setBidderDetails]=useState({
        userType:"bidder" ,
        firstName:"" ,
        lastName:"" ,
        userName:"" ,
        email:"" ,
        password:"" ,
        confirmPassword:"" ,
    });

    
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
				/>
			</div>
			<div>
				<label htmlFor="last-name">Last Name:</label>
				<input
					type="text"
					id="last-name"
					name="lastName"
					placeholder="Enter your last name"
				/>
			</div>
			<div>
				<label htmlFor="user-name">Username:</label>
				<input
					type="text"
					id="user-name"
					name="userName"
					placeholder="Enter your username"
				/>
			</div>
			<div>
				<label htmlFor="email">Email:</label>
				<input
					type="email"
					id="email"
					name="email"
					placeholder="Enter your email address"
				/>
			</div>
			<div>
				<label htmlFor="password">Password:</label>
				<input
					type="password"
					id="password"
					name="password"
					placeholder="Enter your password"
				/>
			</div>
			<div>
				<label htmlFor="confirm-password">Confirm Password:</label>
				<input
					type="password"
					id="confirm-password"
					name="confirmPassword"
					placeholder="Confirm your password"
				/>
			</div>
			<button type="submit">Submit</button>
		</form>
	</>
);
}