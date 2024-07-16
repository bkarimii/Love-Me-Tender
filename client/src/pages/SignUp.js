import React, { useState } from "react";
import BidderSignUp from "./BidderSignUp";
import ContractorSignUp from "./ContractorSignUp";

function SignUp(){
    //To keep track value of radio buttons
    const [userType , setUserType]=useState("");
    //decides signup form to be shown or not
    const [showForm , setShowForm]=useState(false);
	// Radio buttons to be shown or hidden
	const [showRadioForm, setShowRadioForm] = useState(true);
    const handleSubmitUserType=(e)=>{
        e.preventDefault();
        setShowForm(true);
    };
    const handleChangeRdaio=(e)=>{
        setUserType(e.target.value);
    };
	const handleBackButtonClick=()=>{
		setShowForm(false);
		setShowRadioForm(true); // To show radio buttons

	};

    return (
			<>
				<div>
					<div>{showForm && <button onClick={handleBackButtonClick}>Back</button>}</div>
					{!showForm && showRadioForm && (
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
				<div>
					{userType === "contractor" && showForm && <ContractorSignUp />}
				</div>
			</>
		);
}

export default SignUp ;