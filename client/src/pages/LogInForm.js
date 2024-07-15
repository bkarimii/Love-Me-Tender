import React from "react";

function LogInForm(){


    return (
			<>
				<div>
					<form>
						<label htmlFor="email">E-mail:</label>
						<input type="email" id="email" name="email" />
						<label htmlFor="password">Password:</label>
						<input type="password" id="password" name="password" />
						<button type="submit">Log In</button>
					</form>
				</div>
			</>
		);
}

export default LogInForm ;