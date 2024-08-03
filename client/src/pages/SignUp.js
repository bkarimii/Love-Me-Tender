import React, { useState } from "react";
import BidderSignUp from "./BidderSignUp";
import BuyerSignUp from "./BuyerSignUp";

function SignUp() {
	const [userType, setUserType] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [showRadioForm, setShowRadioForm] = useState(true);

	const handleSubmitUserType = (e) => {
		e.preventDefault();
		setShowForm(true);
	};

	const handleChangeRdaio = (e) => {
		setUserType(e.target.value);
	};

	const handleBackButtonClick = () => {
		setShowForm(false);
		setShowRadioForm(true);
	};

	return (
		<>
			<div>
				<div>
					{showForm && <button onClick={handleBackButtonClick}>Back</button>}
				</div>
				{!showForm && showRadioForm && (
					<form onSubmit={handleSubmitUserType}>
						<p>Select the user type: </p>
						<div>
							<input
								type="radio"
								name="user"
								value="buyer"
								checked={userType === "buyer"}
								onChange={handleChangeRdaio}
							/>
							<label htmlFor="buyer">Buyer</label>
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
						<button type="submit" disabled={!userType}>
							Next
						</button>
					</form>
				)}
			</div>
			<div>{userType === "bidder" && showForm && <BidderSignUp />}</div>
			<div>{userType === "buyer" && showForm && <BuyerSignUp />}</div>
		</>
	);
}

export default SignUp;
