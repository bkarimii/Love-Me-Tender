import { Router } from "express";
import bcrypt from "bcryptjs";

const router = Router();

router.get("/", (_, res) => {
	res.status(200).json({ message: "WELCOME TO LOVE ME TENDER SITE" });
});

function validateEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}
router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	const isEmailValid = validateEmail(email);
	if (!isEmailValid) {
		res.status(400).json({ message: "invalidEmailFormat" });
	}
	try {
		const query = "SELECT * FROM users WHERE email = $1";
		const dbResponse = await pool.query(query, [email]);
		if (dbResponse.rows[0].length === 0) {
			res.status(404).json({ message: "notRegistered" });
		}

		const storedHashedPassword = dbResponse.rows[0].password;
		// Compare the password with the stored hashed password
		const passwordMatches = await bcrypt.compare(
			password,
			storedHashedPassword
		);
		if (!passwordMatches) {
			return res.status(401).json({
				message: "worngPassword",
			});
		}
		res.status(201).json({ message: "successful" });
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
