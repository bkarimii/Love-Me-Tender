/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";

function ContractorSignUp(){
    const [contractorDetails , setContractorDetails]=useState({
        firstName:"",
        lastName:"" ,
        email:"" ,
        company:"" ,
        address:"",
        password:"" ,
        confirmPassword:"" ,
    });

    return (
			<>
				<div>
					<form onSubmit={handleSubmit}>
						<div>
							<label htmlFor="company">Company:</label>
							<input
								type="text"
								id="company"
								name="company"
								placeholder="Enter your company name"
								value={contractorDetails.company}
								onChange={handleInputChange}
								required
							/>
						</div>
						<div>
							<label htmlFor="address">Address:</label>
							<input
								type="text"
								id="address"
								name="address"
								placeholder="Enter your address"
								value={contractorDetails.address}
								onChange={handleInputChange}
								required
							/>
						</div>
						{/* ... other form elements */}
						<button type="submit">Submit</button>
					</form>
				</div>
			</>
		);
}

export default ContractorSignUp;