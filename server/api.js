import { Router } from "express";
import logger from "./utils/logger";

const router = Router();

router.get("/", (_, res) => {
	logger.debug("Welcoming everyone...");
	res.json({ message: "Hello, world!" });
});

router.post("/login",async (req , res) => {
	const { email, password } = req.body;
	try{
		// Check if email exists in the database
		const query = "SELECT * FROM users WHERE email = $1";
		const dbResponse = await pool.query(query, [email]);
		if(dbResponse.row.length === 0){
			// If email doesn't exist
			return res.status(404).json({ message : "Email does not exist! if you don't have an account sign up first!" , success : false });
		}
		//Retrieve stored password in the db
		const storedPassword = dbResponse.rows[0].password;
		const passwordMatches = await bcrypt.compare(password,storedPassword); //Compare stored password with users password
		if(!passwordMatches){
			return res.status(401).json({ message: "Password is incorrect!", success : false }); //If passwords doesn't match send back 401 status
		}
		//Otherwise login will be successful
		res.status(200).json({ message: "Login successful", success : true });


	}catch(error){
		res.status(500).json({ message: "Internal server error!", success : false });
	}
});

export default router;
