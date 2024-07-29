import { Router } from "express";
import db, { pool } from "./db";

const itemsPerPage = 25;
const router = Router();

router.get("/", (_, res) => {
	res.status(200).json({ message: "WELCOME TO LOVE ME TENDER SITE" });
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

router.get("/buyer-tender", async (req, res) => {
	const buyerId = 1;
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
	const bidderId = 1;
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

export default router;
