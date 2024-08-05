import nodemailer from "nodemailer";
require("dotenv").config();

const transporter = nodemailer.createTransport({
	service: "gmail",
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
		from: process.env.MAIL_USER,
		to: recipient,
		subject,
		text: message,
		html: message,
	});
};

export default { sendEmail };
