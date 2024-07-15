/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";

function SignUp(){
    const [userType , setUserType]=useState(null);
    



    return (
			<>
				<div>
					<p>I am a :</p>
					<form>
						<div>
							<input type="radio" name="user" value="contractor" />
							<label htmlFor="contractor">Contractor</label>
						</div>
						<div>
							<input type="radio" name="user" value="bidder" />
							<label htmlFor="bidder">Bidder</label>
						</div>
						<button type="submit">Next</button>
					</form>
				</div>
			</>
		);
}

export default SignUp ;