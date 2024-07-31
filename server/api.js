import { Router } from "express";
import db, { pool } from "./db";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const itemsPerPage = 25;
const router = Router();

const allowlist = {
	POST: ["/sign-in"],
};

const auth = async (req, res, next) => {
	try {
		const method = req.method.toUpperCase();
		const path = req.path;

		if (allowlist[method] && allowlist[method].includes(path)) {
			return next();
		}

		const authHeader = req.headers.authorization;
		const token = authHeader?.split(" ")[1];

		if (!token) {
			return res.status(401).json({ code: "UNAUTHRIZED" });
		}

		const sessionResult = await db.query(
			"SELECT * FROM session WHERE token = $1",
			[token]
		);
		const session = sessionResult.rows[0];

		if (!session) {
			return res.status(401).json({ code: "UNAUTHRIZED" });
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
		next();
	} catch (error) {
		res.status(500).json({ code: "SERVER_ERROR" });
	}
};

router.use(auth);

router.get("/", (_, res) => {
	res.status(200).json({ message: "WELCOME TO LOVE ME TENDER SITE" });
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
		INSERT INTO tender (title, announcement_date, deadline, description, closing_date)
		VALUES ($1, $2, $3, $4, $5) RETURNING id
		`;
		const tenderResult = await client.query(insertTenderQuery, [
			title,
			announcementDate,
			deadlineDate,
			description,
			closingDate,
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
		"SELECT COUNT(buyer_id) FROM bid WHERE buyer_id = $1",
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
	const page = parseInt(req.query.page) || 1;
	const offset = (page - 1) * itemsPerPage;

	const totalBiddings = await db.query(
		"SELECT COUNT(bidder_id) FROM bid WHERE bidder_id = $1",
		[bidderId]
	);
	const totalPages = Math.ceil(totalBiddings.rows[0].count / itemsPerPage);

	const result = await db.query(
		"SELECT * FROM bid WHERE bidder_id = $1 LIMIT $2 OFFSET $3",
		[bidderId, itemsPerPage, offset]
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

router.get("/tenders", async (req, res) => {
	const page = parseInt(req.query.page, 10) || 1;
	const limit = 25;
	const offset = (page - 1) * limit;

	const countSql = "SELECT COUNT(*) FROM tender";
	const dataSql = `
		SELECT id, title, creation_date, announcement_date, deadline, status 
		FROM tender 
		ORDER BY creation_date DESC 
		LIMIT $1 OFFSET $2
	`;
	try {
		const countResult = await db.query(countSql);
		const totalItems = parseInt(countResult.rows[0].count, 10);
		const totalPages = Math.ceil(totalItems / limit);

		const dataResult = await db.query(dataSql, [limit, offset]);
		const tenders = dataResult.rows;

		res.status(200).json({
			results: tenders,
			pagination: {
				itemsPerPage: limit,
				currentPage: page,
				totalPages,
			},
		});
	} catch (err) {
		res.status(500).json({ code: "SERVER_ERROR" });
	}
});

router.get("/bid", async (req, res) => {
	const tenderID = parseInt(req.query.tender_id);
	let page = parseInt(req.query.page) || 1;
	const itemsPerPage = 10;

	const totalBidsPerTender = await db.query(
		"SELECT COUNT(tender_id) FROM bid WHERE tender_id = $1",
		[tenderID]
	);
	const totalPages = Math.ceil(totalBidsPerTender.rows[0].count / itemsPerPage);
	const offset = (page - 1) * itemsPerPage;

	const totalBidsResults = await db.query(
		"SELECT * FROM bid WHERE tender_id = $1 LIMIT $2 OFFSET $3",
		[tenderID, itemsPerPage, offset]
	);

	totalBidsResults
		? res.send({
				results: totalBidsResults.rows,
				pagination: {
					itemsPerPage: 10,
					currentPage: page,
					totalPages: totalPages,
				},
		  })
		: res.status(500).send({ code: "SERVER_ERROR" });
});

router.post("/bid/:bidId/status", async (req, res) => {
	const bidId = parseInt(req.params.bidId, 10);
	const status = req.body.status;
	const validStatuses = ["Awarded", "Rejected", "Withdraw", "In review"];

	if (!validStatuses.includes(status)) {
		return res.status(400).send({ code: "INVALID_STATUS" });
	}

	let client;

	try {
		client = await pool.connect();

		await client.query("BEGIN");

		const tenderResult = await client.query(
			"SELECT tender_id FROM bid WHERE bid_id = $1;",
			[bidId]
		);

		if (tenderResult.rowCount === 0) {
			await client.query("ROLLBACK");
			return res.status(404).send({ code: "BID_NOT_FOUND" });
		}

		const tenderId = parseInt(tenderResult.rows[0].tender_id);

		if (status === "Awarded") {
			const rejectStatus = "Rejected";
			const awardBidResult = await client.query(
				"UPDATE bid SET status = $1 WHERE tender_id = $2 AND bid_id = $3;",
				[status, tenderId, bidId]
			);

			const rejectOtherBidsResult = await client.query(
				"UPDATE bid SET status = $1 WHERE tender_id = $2 AND bid_id != $3;",
				[rejectStatus, tenderId, bidId]
			);

			if (awardBidResult.rowCount > 0 || rejectOtherBidsResult.rowCount > 0) {
				await client.query("COMMIT");
				return res.status(200).send({ code: "SUCCESS" });
			} else {
				await client.query("ROLLBACK");
				return res.status(500).send({ code: "SERVER_ERROR" });
			}
		} else {
			const updateBidResult = await client.query(
				"UPDATE bid SET status = $1 WHERE tender_id = $2 AND bid_id = $3;",
				[status, tenderId, bidId]
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
		return res.status(500).send({ code: "SERVER_ERROR", error: error.message });
	} finally {
		if (client) {
			client.release();
		}
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

export default router;
