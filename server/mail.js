import nodemailer from "nodemailer";
require("dotenv").config();

const transporter = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	secure: true,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASSWORD,
	},
});

const sendEmail = async ({ recipient, subject, message }) => {
	return await transporter.sendMail({
		from: "no_reply@example.com",
		to: recipient,
		subject,
		text: message,
		html: message,
	});
};

export default { sendEmail };
