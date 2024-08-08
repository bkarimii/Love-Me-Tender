import { Router } from "express";
import db, { pool } from "./db";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import mail from "./mail";

const itemsPerPage = 25;
const router = Router();

const allowlist = {
	POST: {
		"/sign-in": "public",
		"/tender": "buyer",
		"/bid": "token",
		"/logout": "token",
		"/signup": "admin",
	},
	GET: {
		"/skills": "token",
		"/buyer-tender": "token",
		"/bidder-bid": "token",
		"/tenders": "token",
		"/bid": "token",
	},
};

const auth = async (req, res, next) => {
	try {
		const method = req.method.toUpperCase();
		const path = req.path;
		const firstPathSegment = path.split("/")[1];

		const allowedAccess =
			allowlist[method] && allowlist[method][[`/${firstPathSegment}`]];

		if (allowedAccess === "public") {
			return next();
		}

		const authHeader = req.headers.authorization;
		const token = authHeader?.split(" ")[1];

		if (!token) {
			return res.status(401).json({ code: "UNAUTHORIZED" });
		}

		const sessionResult = await db.query(
			"SELECT * FROM session WHERE token = $1",
			[token]
		);
		const session = sessionResult.rows[0];

		if (!session) {
			return res.status(401).json({ code: "UNAUTHORIZED" });
		}

		const currentTime = new Date();
		if (session.expires_at <= currentTime) {
			return res.status(401).json({ code: "EXPIRED_SESSION" });
		}

		const userResult = await db.query("SELECT * FROM users WHERE id = $1", [
			session.user_id,
		]);
		const user = userResult.rows[0];

		if (!user) {
			return res.status(500).json({ code: "SERVER_ERROR" });
		}

		req.user = user;

		if (user.role === "admin") {
			return next();
		}

		if (user.user_type === allowedAccess) {
			return next();
		}

		if (allowedAccess === "token") {
			return next();
		}

		return res.status(403).json({ code: "FORBIDDEN" });
	} catch (error) {
		res.status(500).json({ code: "SERVER_ERROR" });
	}
};

router.use(auth);

router.get("/", (_, res) => {
	res.status(200).json({ message: "WELCOME TO LOVE ME TENDER SITE" });
});

function generateRandomPassword(length = 12) {
	const lowerCase = "abcdefghijklmnopqrstuvwxyz";
	const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const numbers = "0123456789";
	const specialChars = "!@#$%^&*()_-+=";

	const allChars = lowerCase + upperCase + numbers + specialChars;

	let password = "";
	password += lowerCase.charAt(Math.floor(Math.random() * lowerCase.length));
	password += upperCase.charAt(Math.floor(Math.random() * upperCase.length));
	password += numbers.charAt(Math.floor(Math.random() * numbers.length));
	password += specialChars.charAt(
		Math.floor(Math.random() * specialChars.length)
	);

	for (let i = 4; i < length; i++) {
		password += allChars.charAt(Math.floor(Math.random() * allChars.length));
	}

	return password;
}

function validateEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

router.post("/signup", async (req, res) => {
	const {
		email,
		userType,
		firstName,
		lastName,
		company,
		address,
		description,
	} = req.body;

	const errors = [];

	if (!validateEmail(email)) {
		errors.push("Invalid email format");
	}

	if (!["bidder", "buyer"].includes(userType)) {
		errors.push("Invalid user type. Allowed values are 'bidder' and 'buyer'");
	}

	if (userType === "bidder" && (!firstName || !lastName)) {
		errors.push("First name and last name are required for buyers");
	}

	if (userType === "buyer" && (!company || !address)) {
		errors.push("Company and address are required for buyers");
	}

	if (errors.length > 0) {
		return res.status(400).json({
			code: "VALIDATION_ERROR",
			errors: errors,
		});
	}

	const client = await pool.connect();

	try {
		await client.query("BEGIN");
		const password = generateRandomPassword();
		const hashedPassword = await bcrypt.hash(password, 10);

		const userQuery =
			"INSERT INTO users (email, password_hash, user_type) VALUES ($1, $2, $3) RETURNING id";
		const userValues = [email, hashedPassword, userType];

		const userResult = await client.query(userQuery, userValues);

		if (!userResult.rows[0] || !userResult.rows[0].id) {
			throw new Error("Failed to insert user into the users table");
		}
		const userId = userResult.rows[0].id;

		let userTableQuery;
		let userTableValues;

		if (userType === "bidder") {
			userTableQuery =
				"INSERT INTO bidder (user_id, first_name, last_name, last_update) VALUES ($1, $2, $3, NOW())";
			userTableValues = [userId, firstName, lastName];
		} else if (userType === "buyer") {
			userTableQuery =
				"INSERT INTO buyer (user_id, company, description, address, last_update) VALUES ($1, $2, $3, $4, NOW())";
			userTableValues = [userId, company, description, address];
		} else {
			await client.query("ROLLBACK");
			console.error(error); // eslint-disable-line no-console, no-undef
			return res.status(500).json({ code: "SERVER_ERROR" });
		}

		await client.query(userTableQuery, userTableValues);
		await client.query("COMMIT");

		const subject = "Welcome to Love Me Tender!";
		const message = `
            <h1>Welcome to Our Service</h1>
            <p>Your account has been created successfully.</p>
            <p>Your login details are:</p>
            <p>Email: ${email}</p>
            <p>Password: ${password}</p> 
        `;

		await mail.sendEmail({
			recipient: email,
			subject,
			message,
		});

		res.status(201).json({});
	} catch (error) {
		await client.query("ROLLBACK");
		console.error(error); // eslint-disable-line no-console, no-undef
		res.status(500).json({ code: "SERVER_ERROR" });
	} finally {
		client.release();
	}
});

router.get("/skills", async (req, res) => {
	try {
		const result = await db.query(
			"SELECT skill_id, skill_name FROM skill ORDER BY skill_name ASC"
		);
		res.status(200).json({ results: result.rows });
	} catch (error) {
		res.status(500).json({ code: "SERVER_ERROR" });
	}
});

router.post("/tender", async (req, res) => {
	const {
		title,
		description,
		closingDate,
		announcementDate,
		deadlineDate,
		selectedSkills,
	} = req.body;

	const newErrors = [];

	if (!title || title.length < 10 || title.length > 50) {
		newErrors.push("Tender Title must be between 10 and 50 characters.");
	}

	if (!description || description.length < 100 || description.length > 7500) {
		newErrors.push(
			"Tender Description must be between 100 and 7500 characters."
		);
	}

	const today = new Date().toISOString().split("T")[0];
	if (closingDate < today) {
		newErrors.push("Tender Closing Date cannot be in the past.");
	}

	if (announcementDate > closingDate) {
		newErrors.push("Tender Announcement Date must be before the Closing Date.");
	}

	if (deadlineDate < announcementDate) {
		newErrors.push(
			"Tender Project Deadline Date must be after the Announcement Date."
		);
	}

	if (selectedSkills.length === 0) {
		newErrors.push("Please select at least one skill.");
	}

	if (newErrors.length > 0) {
		return res
			.status(400)
			.json({ code: "VALIDATION_ERROR", errors: newErrors });
	}

	const client = await pool.connect();
	try {
		await client.query("BEGIN");

		const insertTenderQuery = `
		INSERT INTO tender (title, announcement_date, deadline, description, closing_date, status)
		VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
		`;
		const tenderResult = await client.query(insertTenderQuery, [
			title,
			announcementDate,
			deadlineDate,
			description,
			closingDate,
			"Active",
		]);
		const tenderId = tenderResult.rows[0].id;

		const insertTenderSkillsQuery = `
		INSERT INTO tender_skill (tender_id, skill_id)
		VALUES ($1, $2)
		`;
		for (const skillId of selectedSkills) {
			await client.query(insertTenderSkillsQuery, [tenderId, skillId]);
		}

		await client.query("COMMIT");

		const fetchTenderQuery = `
		SELECT * FROM tender WHERE id = $1
		`;
		const tenderDetails = await client.query(fetchTenderQuery, [tenderId]);

		res.status(201).json({ resource: tenderDetails.rows[0] });
	} catch (error) {
		await client.query("ROLLBACK");
		res.status(500).json({ code: "SERVER_ERROR" });
	} finally {
		client.release();
	}
});

router.get("/buyer-tender", async (req, res) => {
	const buyerId = req.user.id;
	let page = parseInt(req.query.page) || 1;
	const offset = (page - 1) * itemsPerPage;

	const totalBuyerTenders = await db.query(
		"SELECT COUNT(buyer_id) FROM tender WHERE buyer_id = $1",
		[buyerId]
	);
	const totalPages = Math.ceil(totalBuyerTenders.rows[0].count / itemsPerPage);

	const result = await db.query(
		"SELECT * FROM tender WHERE buyer_id = $1 LIMIT $2 OFFSET $3",
		[buyerId, itemsPerPage, offset]
	);

	result
		? res.send({
				results: result.rows,
				pagination: {
					itemsPerPage: itemsPerPage,
					currentPage: page,
					totalPages: totalPages,
				},
		  })
		: res.status(500).send({ code: "SERVER_ERROR" });
});

router.get("/bidder-bid", async (req, res) => {
	const bidderId = req.user.id;
	const page = parseInt(req.query.page, 10) || 1;
	const offset = (page - 1) * itemsPerPage;

	try {
		const countResult = await db.query(
			"SELECT COUNT(*) FROM bid WHERE bidder_id = $1",
			[bidderId]
		);
		const totalItems = parseInt(countResult.rows[0].count, 10);
		const totalPages = Math.ceil(totalItems / itemsPerPage);

		const bidsResult = await db.query(
			`
			SELECT b.bid_id, b.tender_id, b.bidding_amount, b.status, b.bidding_date AS submission_date, b.suggested_duration_days, t.title, t.announcement_date, t.closing_date
			FROM bid b
			JOIN tender t ON b.tender_id = t.id
			WHERE b.bidder_id = $1
			ORDER BY b.bidding_date DESC
			LIMIT $2 OFFSET $3
			`,
			[bidderId, itemsPerPage, offset]
		);
		const bids = bidsResult.rows;

		res.status(200).json({
			results: bids,
			pagination: {
				itemsPerPage,
				currentPage: page,
				totalPages,
			},
		});
	} catch (error) {
		res.status(500).json({ code: "SERVER_ERROR" });
	}
});

router.get("/tenders", async (req, res) => {
	const page = parseInt(req.query.page, 10) || 1;
	const limit = 25;
	const offset = (page - 1) * limit;

	const sort = req.query.sort || "creation_date";
	const validSorts = ["creation_date", "closing_date", "deadline"];

	if (!validSorts.includes(sort)) {
		return res.status(400).json({ code: "INVALID_SORT_FIELD" });
	}

	const countSql = "SELECT COUNT(*) FROM tender";
	const tendersSql = `
		SELECT id, title, creation_date, announcement_date, deadline, description, status, closing_date, last_update
        FROM tender
        ORDER BY creation_date DESC
		    LIMIT $1 OFFSET $2
	`;

	try {
		const countResult = await db.query(countSql);
		const totalItems = parseInt(countResult.rows[0].count, 10);
		const totalPages = Math.ceil(totalItems / limit);

		const tendersResult = await db.query(tendersSql, [limit, offset]);
		const tenders = tendersResult.rows;

		const tenderIds = tenders.map((tender) => tender.id);

		if (tenderIds.length > 0) {
			const bidsSql = `
				SELECT *
				FROM bid
				WHERE tender_id = ANY($1::int[])
			`;

			const bidsResult = await db.query(bidsSql, [tenderIds]);

			const bidsByTenderId = bidsResult.rows.reduce((acc, bid) => {
				if (!acc[bid.tender_id]) {
					acc[bid.tender_id] = [];
				}
				acc[bid.tender_id].push(bid);
				return acc;
			}, {});

			const tendersWithBids = tenders.map((tender) => ({
				...tender,
				bids: bidsByTenderId[tender.id] || [],
			}));

			res.status(200).json({
				results: tendersWithBids,
				pagination: {
					itemsPerPage: limit,
					currentPage: page,
					totalPages,
				},
			});
		} else {
			res.status(200).json({
				results: [],
				pagination: {
					itemsPerPage: limit,
					currentPage: page,
					totalPages,
				},
			});
		}
	} catch (err) {
		res.status(500).json({ code: "SERVER_ERROR" });
	}
});

router.get("/tenders/:id", async (req, res) => {
	const tenderId = parseInt(req.params.id, 10);

	if (isNaN(tenderId)) {
		return res.status(400).json({});
	}

	try {
		const tenderResult = await db.query(
			`SELECT id, title, creation_date, announcement_date, deadline, description, status, closing_date
             FROM tender WHERE id = $1`,
			[tenderId]
		);

		if (tenderResult.rows.length === 0) {
			return res.status(404).json({});
		}

		const bidsResult = await db.query(
			`SELECT bid.bid_id, bid.tender_id, bid.bidding_amount, bid.status, bid.suggested_duration_days
     FROM bid
     JOIN tender ON bid.tender_id = tender.id
     WHERE tender.id = $1`,
			[tenderId]
		);

		const tender = tenderResult.rows[0];
		tender.bids = bidsResult.rows;

		res.status(200).json({ resource: tender });
	} catch (error) {
		res.status(500).json({ code: "SERVER_ERROR" });
	}
});

router.get("/bid", async (req, res) => {
	try {
		const userId = req.user.id;
		const userRole = req.user.user_type;
		const tenderID = parseInt(req.query.tender_id);
		let page = parseInt(req.query.page) || 1;
		const itemsPerPage = 10;
		const offset = (page - 1) * itemsPerPage;
		let totalBidsQuery;
		let totalBidsParams;
		let bidsQuery;
		let bidsParams;

		if (userRole === "bidder") {
			totalBidsQuery =
				"SELECT COUNT(*) FROM bid WHERE bidder_id = $1 AND tender_id = $2";
			totalBidsParams = [userId, tenderID];
			bidsQuery =
				"SELECT * FROM bid WHERE bidder_id = $1 AND tender_id = $2 LIMIT $3 OFFSET $4";
			bidsParams = [userId, tenderID, itemsPerPage, offset];
		} else if (userRole === "buyer") {
			totalBidsQuery = `
				SELECT COUNT(*) FROM bid 
				JOIN tender ON bid.tender_id = tender.id 
				WHERE tender.buyer_id = $1 AND bid.tender_id = $2
			`;
			totalBidsParams = [userId, tenderID];
			bidsQuery = `
SELECT bid.*, bidder.first_name, bidder.last_name, ba.attachment
				FROM bid
				JOIN bidder ON bid.bidder_id = bidder.user_id
				JOIN tender ON bid.tender_id = tender.id
				JOIN bid_attachment as ba ON bid.bid_id = ba.bid_id
				WHERE tender.buyer_id = $1
  				AND bid.tender_id = $2
				LIMIT $3 OFFSET $4;
			`;
			bidsParams = [userId, tenderID, itemsPerPage, offset];
		} else {
			return res.status(403).json({ code: "FORBIDDEN" });
		}

		const totalBidsResult = await db.query(totalBidsQuery, totalBidsParams);
		const totalPages = Math.ceil(totalBidsResult.rows[0].count / itemsPerPage);
		const bidsResult = await db.query(bidsQuery, bidsParams);

		res.send({
			results: bidsResult.rows,
			pagination: {
				itemsPerPage: itemsPerPage,
				currentPage: page,
				totalPages: totalPages,
			},
		});
	} catch (error) {
		res.status(500).json({ code: "SERVER_ERROR" });
	}
});

router.post("/bid/:bidId/status", async (req, res) => {
	const bidId = parseInt(req.params.bidId, 10);
	const status = req.body.status;
	const validStatuses = ["Awarded", "Rejected", "Withdrawn", "In review"];
	const user = req.user;

	if (!validStatuses.includes(status)) {
		return res.status(400).send({ code: "INVALID_STATUS" });
	}

	let client;

	try {
		client = await pool.connect();

		await client.query("BEGIN");

		const bidResult = await client.query(
			"SELECT tender_id, bidder_id FROM bid WHERE bid_id = $1;",
			[bidId]
		);

		if (bidResult.rowCount === 0) {
			await client.query("ROLLBACK");
			return res.status(404).send({ code: "BID_NOT_FOUND" });
		}

		const bid = bidResult.rows[0];
		const tenderId = bid.tender_id;
		const bidderId = bid.bidder_id;

		const tenderResult = await client.query(
			"SELECT buyer_id FROM tender WHERE id = $1;",
			[tenderId]
		);

		if (tenderResult.rowCount === 0) {
			await client.query("ROLLBACK");
			return res.status(500).send({ code: "SERVER_ERROR" });
		}

		const buyerId = tenderResult.rows[0].buyer_id;

		if (
			(status === "Awarded" || status === "Rejected") &&
			user.id !== buyerId
		) {
			await client.query("ROLLBACK");
			return res.status(403).send({ code: "FORBIDDEN" });
		}

		if (status === "Withdrawn" && user.id !== bidderId) {
			await client.query("ROLLBACK");
			return res.status(403).send({ code: "FORBIDDEN" });
		}

		if (status === "Active") {
			const activeBidCheck = await client.query(
				"SELECT bid_id FROM bid WHERE tender_id = $1 AND bidder_id = $2 AND status = 'Active' AND bid_id != $3;",
				[tenderId, bidderId, bidId]
			);

			if (activeBidCheck.rowCount > 0) {
				await client.query("ROLLBACK");
				return res.status(400).send({ code: "DUPLICATE_ACTIVE_BID" });
			}
		}

		if (status === "Awarded") {
			const rejectStatus = "Rejected";

			const awardBidResult = await client.query(
				"UPDATE bid SET status = $1 WHERE bid_id = $2;",
				[status, bidId]
			);

			const rejectOtherBidsResult = await client.query(
				"UPDATE bid SET status = $1 WHERE tender_id = $2 AND bid_id != $3;",
				[rejectStatus, tenderId, bidId]
			);

			if (awardBidResult.rowCount > 0 || rejectOtherBidsResult.rowCount >= 0) {
				await client.query("COMMIT");
				return res.status(200).send({ code: "SUCCESS" });
			} else {
				await client.query("ROLLBACK");
				return res.status(500).send({ code: "SERVER_ERROR" });
			}
		} else {
			const updateBidResult = await client.query(
				"UPDATE bid SET status = $1 WHERE bid_id = $2;",
				[status, bidId]
			);

			if (updateBidResult.rowCount > 0) {
				await client.query("COMMIT");
				return res.status(200).send({ code: "SUCCESS" });
			} else {
				await client.query("ROLLBACK");
				return res.status(500).send({ code: "SERVER_ERROR" });
			}
		}
	} catch (error) {
		if (client) {
			await client.query("ROLLBACK");
		}
		return res.status(500).send({ code: "SERVER_ERROR" });
	} finally {
		if (client) {
			client.release();
		}
	}
});

const validStatuses = ["Active", "Withdrawn", "Awarded", "Rejected"];

router.post("/bid", async (req, res) => {
	try {
		const { tenderId, bidding_amount, cover_letter, suggested_duration_days } =
			req.body;
		const bidderId = req.user.id;
		const biddingDate = new Date();
		const status = "Active";

		const errors = [];

		if (!validStatuses.includes(status)) {
			console.error(error); // eslint-disable-line no-console, no-undef
			res.status(500).json({ code: "SERVER_ERROR" });
		}

		if (cover_letter && cover_letter.length > 1000) {
			errors.push("Maximum length is upto 1,000 characters");
		}

		if (
			!suggested_duration_days ||
			suggested_duration_days < 1 ||
			suggested_duration_days > 1000
		) {
			errors.push("Duration must be between 1 and 1,000 days");
		}

		if (!bidding_amount || isNaN(bidding_amount) || bidding_amount <= 0) {
			errors.push("Input a valid bidding amount");
		}

		if (errors.length > 0) {
			return res.status(400).json({
				code: "VALIDATION_ERROR",
				errors: errors,
			});
		}

		const client = await pool.connect();

		try {
			await client.query("BEGIN");

			const checkBidQuery = `
				SELECT * FROM bid WHERE tender_id = $1 AND bidder_id = $2 AND status = 'Active'
			`;

			const checkBidValues = [tenderId, bidderId];
			const existingBid = await client.query(checkBidQuery, checkBidValues);

			if (existingBid.rows.length > 0) {
				await client.query("ROLLBACK");
				return res.status(400).json({ code: "DUPLICATE_ENTRY" });
			}
			const bidQuery = `
                      INSERT INTO bid (tender_id, bidder_id, bidding_date, status, bidding_amount, cover_letter, suggested_duration_days)
					  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING bid_id
                    `;
			const bidValues = [
				tenderId,
				bidderId,
				biddingDate,
				status,
				bidding_amount,
				cover_letter || null,
				suggested_duration_days,
			];

			const bidResult = await client.query(bidQuery, bidValues);

			await client.query("COMMIT");

			res.status(201).json({
				resource: bidResult.rows[0],
			});
		} catch (error) {
			await client.query("ROLLBACK");
			console.error(error); // eslint-disable-line no-console, no-undef
			res.status(500).json({ code: "SERVER_ERROR" });
		} finally {
			client.release();
		}
	} catch (error) {
		console.error(error); // eslint-disable-line no-console, no-undef
		res.status(500).json({ code: "SERVER_ERROR" });
	}
});

router.post("/sign-in", async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({});
	}

	try {
		const userResult = await db.query("SELECT * FROM users WHERE email = $1", [
			email,
		]);

		const user = userResult.rows[0];

		if (!user) {
			return res.status(401).json({});
		}

		const isPasswordMatch = bcrypt.compareSync(password, user.password_hash);

		if (!isPasswordMatch) {
			return res.status(401).json({});
		}

		const token = uuidv4();
		const expirationDate = new Date();
		expirationDate.setMonth(expirationDate.getMonth() + 1);

		await db.query(
			"INSERT INTO session (token, user_id, expiration_date) VALUES ($1, $2, $3)",
			[token, user.id, expirationDate]
		);

		res.status(200).json({
			resource: {
				token: token,
				user_type: user.user_type,
			},
		});
	} catch (error) {
		res.status(500).json({ code: "SERVER_ERROR" });
	}
});

router.post("/logout", async (req, res) => {
	try {
		await db.query("DELETE FROM session WHERE user_id = $1", [req.user.id]);

		res.status(200).json({ code: "LOGOUT_SUCCESS" });
	} catch (error) {
		res.status(500).json({ code: "SERVER_ERROR" });
	}
});

export default router;
