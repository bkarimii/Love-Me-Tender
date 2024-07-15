/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";

function SignUp(){
    //to keep track value of radio buttons
    const [userType , setUserType]=useState("");

    //decides signup form to be shown or now
    const [showForm , setShowForm]=useState(false);
    
    const handleSubmitUserType=(e)=>{
        e.preventDefault();
        console.log(userType);

    };

    const handleChangeRdaio=(e)=>{
        setUserType(e.target.value);
    };

    return (
			<>
				<div>
					<p>I am a :</p>
					{!showForm && (
						<form onSubmit={handleSubmitUserType}>
							<div>
								<input
									type="radio"
									name="user"
									value="contractor"
									checked={userType === "contractor"}
									onChange={handleChangeRdaio}
								/>
								<label htmlFor="contractor">Contractor</label>
							</div>
							<div>
								<input
									type="radio"
									name="user"
									value="bidder"
									checked={userType === "bidder"}
									onChange={handleChangeRdaio}
								/>
								<label htmlFor="bidder">Bidder</label>
							</div>
							<button type="submit">Next</button>
						</form>
					)}
				</div>
			</>
		);
}

export default SignUp ;