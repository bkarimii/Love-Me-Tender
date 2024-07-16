/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import BidderSignUp from "./BidderSignUp";

function SignUp(){
    //to keep track value of radio buttons
    const [userType , setUserType]=useState("");

    //decides signup form to be shown or now
    const [showForm , setShowForm]=useState(false);
    
    const handleSubmitUserType=(e)=>{
        e.preventDefault();
        setShowForm(true);

    };

    const handleChangeRdaio=(e)=>{
        setUserType(e.target.value);
    };

    return (
			<>
				<div>
					{!showForm && (
						<form onSubmit={handleSubmitUserType}>
							<p>I am a :</p>
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
				<div>{userType === "bidder" && showForm && <BidderSignUp />}</div>
			</>
		);
}

export default SignUp ;