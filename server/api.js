import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
	res.status(200).json({ message: "WELCOME TO LOVE ME TENDER SITE" });
});

router.post("/register-users", async (req, res) => {
	const userType = req.body.userType;
	const {
		firstName,
		lastName,
		userName,
		email,
		password,
		confirmPassword,
		company,
		description,
		address,
	} = req.body;

	if (password !== confirmPassword) {
		return res.status(400).json({ message: "mismatchPassword" });
	}

	try {
		const queryToCheckEmail = "SELECT * FROM users WHERE email = $1";
		const emailCheckResponse = await pool.query(queryToCheckEmail, [email]);

		if (emailCheckResponse.rows.length > 0) {
			return res.status(409).json({ message: "emailAlreadyExists" });
		}
		// Hash the password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const queryToInsertUsers =
			"INSERT INTO users(email, password_hash, userType ) VALUES($1, $2, $3) RETURNING id";
		const insertIntoUsers = await pool.query(queryToInsertUsers, [
			email,
			hashedPassword,
			userType,
		]);
		const userId = insertIntoUsers.rows[0].id;
		if (userType === "bidder") {
			const queryForBidder =
				"INSERT INTO bidder (user_id, user_name, first_name, last_name, last_update) VALUES ($1, $2, $3, $4, NOW())";
			await pool.query(queryForBidder, [userId, userName, firstName, lastName]);
		} else if (userType === "buyer") {
			const buyerQuery =
				"INSERT INTO buyer (user_id, company, description, address, last_update) VALUES ($1, $2, $3, $4, NOW())";
			await pool.query(buyerQuery, [userId, company, description, address]);
		} else {
			return res.status(400).json({ message: "invalidType" });
		}
	} catch (error) {
		res.status(500).json({ message: "serverError" });
	}
});

router.get("/skills", (req, res) => {
	const skills = [
		"Website",
		"Android",
		"iOS",
		"Backend",
		"Frontend",
		"Full-stack",
	];

	skills.sort();

	res.status(200).json({ skills });
});

router.post("/publish-tenders", (req, res) => {
	const formData = req.body;

	const newErrors = [];

	if (
		!formData.title ||
		formData.title.length < 10 ||
		formData.title.length > 50
	) {
		newErrors.push("Tender Title must be between 10 and 50 characters.");
	}

	if (
		!formData.description ||
		formData.description.length < 100 ||
		formData.description.length > 7500
	) {
		newErrors.push(
			"Tender Description must be between 100 and 7500 characters."
		);
	}

	const today = new Date().toISOString().split("T")[0];
	if (formData.closingDate < today) {
		newErrors.push("Tender Closing Date cannot be in the past.");
	}

	if (formData.announcementDate > formData.closingDate) {
		newErrors.push("Tender Announcement Date must be before the Closing Date.");
	}

	if (formData.deadlineDate < formData.announcementDate) {
		newErrors.push(
			"Tender Project Deadline Date must be after the Announcement Date."
		);
	}

	if (formData.selectedSkills.length === 0) {
		newErrors.push("Please select at least one skill.");
	}

	if (newErrors.length > 0) {
		return res.status(400).json({ errors: newErrors });
	}

	res.status(200).json({ message: "Form submitted successfully!" });
});

router.get("/skills", (req, res) => {
	const skills = [
		"Website",
		"Android",
		"iOS",
		"Backend",
		"Frontend",
		"Full-stack",
	];

	skills.sort();

	res.status(200).json({ skills });
});

router.post("/publish-tenders", (req, res) => {
	const formData = req.body;

	const newErrors = [];

	if (
		!formData.title ||
		formData.title.length < 10 ||
		formData.title.length > 50
	) {
		newErrors.push("Tender Title must be between 10 and 50 characters.");
	}

	if (
		!formData.description ||
		formData.description.length < 100 ||
		formData.description.length > 7500
	) {
		newErrors.push(
			"Tender Description must be between 100 and 7500 characters."
		);
	}

	const today = new Date().toISOString().split("T")[0];
	if (formData.closingDate < today) {
		newErrors.push("Tender Closing Date cannot be in the past.");
	}

	if (formData.announcementDate > formData.closingDate) {
		newErrors.push("Tender Announcement Date must be before the Closing Date.");
	}

	if (formData.deadlineDate < formData.announcementDate) {
		newErrors.push(
			"Tender Project Deadline Date must be after the Announcement Date."
		);
	}

	if (formData.selectedSkills.length === 0) {
		newErrors.push("Please select at least one skill.");
	}

	if (newErrors.length > 0) {
		return res.status(400).json({ errors: newErrors });
	}

	res.status(200).json({ message: "Form submitted successfully!" });
});

export default router;
