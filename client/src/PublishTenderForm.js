import React, { useState, useEffect } from "react";
import "./PublishTenderForm.css";
import { get, post } from "./TenderClient";
import "./styles.css";
import Select from "react-select";
import Logo from "./assets/images/CTY-logo-rectangle.png";

const PublishTenderForm = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [closingDate, setClosingDate] = useState("");
	const [announcementDate, setAnnouncementDate] = useState("");
	const [deadlineDate, setDeadlineDate] = useState("");
	const [skills, setSkills] = useState([]);
	const [selectedSkills, setSelectedSkills] = useState([]);
	const [errors, setErrors] = useState([]);

	useEffect(() => {
		const fetchSkills = async () => {
			try {
				const data = await get("/api/skills");
				setSkills(data.results);
				setErrors([]);
			} catch (error) {
				setErrors(["Failed to fetch skills. Please try again later."]);
			}
		};

		fetchSkills();
	}, []);

	const options = skills.map((skill) => ({
		value: skill.skill_id,
		label: skill.skill_name,
	}));

	const handleChange = (selectedOptions) => {
		setSelectedSkills(selectedOptions);
	};

	const handleTitleChange = (e) => {
		setTitle(e.target.value);
	};

	const handleDescriptionChange = (e) => {
		setDescription(e.target.value);
	};

	const handleClosingDateChange = (e) => {
		setClosingDate(e.target.value);
	};

	const handleAnnouncementDateChange = (e) => {
		setAnnouncementDate(e.target.value);
	};

	const handleDeadlineDateChange = (e) => {
		setDeadlineDate(e.target.value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const newErrors = [];

		if (title.length < 10 || title.length > 50) {
			newErrors.push("Tender Title must be between 10 and 50 characters.");
		}

		if (description.length < 100 || description.length > 7500) {
			newErrors.push(
				"Tender Description must be between 100 and 7500 characters."
			);
		}

		const today = new Date().toISOString().split("T")[0];
		if (closingDate < today) {
			newErrors.push("Tender Closing Date cannot be in the past.");
		}

		if (announcementDate > closingDate) {
			newErrors.push(
				"Tender Announcement Date must be before the Closing Date."
			);
		}

		if (deadlineDate < announcementDate) {
			newErrors.push(
				"Tender Project Deadline Date must be after the Announcement Date."
			);
		}

		if (selectedSkills.length === 0) {
			newErrors.push("Please select at least one skill.");
		}

		if (newErrors.length === 0) {
			try {
				const formData = {
					title,
					description,
					closingDate,
					announcementDate,
					deadlineDate,
					selectedSkills: selectedSkills.map((skill) => skill.value),
				};
				await post("api/tender", formData);

				setTitle("");
				setDescription("");
				setClosingDate("");
				setAnnouncementDate("");
				setDeadlineDate("");
				setSelectedSkills([]);
				setErrors([]);
				alert("Tender published successfully!");
			} catch (error) {
				setErrors([error.message]);
			}
		} else {
			setErrors(newErrors);
		}
	};

	return (
		<main>
			<div className="publish-form-container">
				<div className="form-logo">
					<img src={Logo} alt="logo" />
				</div>
				<h1 className="form-heading">Publish New Tender</h1>
				{errors.length > 0 && (
					<div className="error-message">
						<ul>
							{errors.map((error, index) => (
								<li key={index}>{error}</li>
							))}
						</ul>
					</div>
				)}
				<form className="form-publish" onSubmit={handleSubmit}>
					<div className="form-label">
						<label htmlFor="title">Tender Title:</label>
						<input
							className="form-input"
							type="text"
							id="title"
							value={title}
							onChange={handleTitleChange}
							maxLength="50"
							required
						/>
					</div>
					<div className="form-label form-description">
						<label htmlFor="description">Tender Description:</label>
						<textarea
							className="form-input"
							id="description"
							value={description}
							onChange={handleDescriptionChange}
							maxLength="7500"
							required
						></textarea>
					</div>
					<div className="form-label date">
						<label htmlFor="announcementDate">Tender Announcement Date:</label>
						<input
							className="form-input"
							type="date"
							id="announcementDate"
							value={announcementDate}
							onChange={handleAnnouncementDateChange}
							required
						/>
					</div>
					<div className="form-label date">
						<label htmlFor="closingDate">Tender Closing Date:</label>
						<input
							className="form-input"
							type="date"
							id="closingDate"
							value={closingDate}
							onChange={handleClosingDateChange}
							required
						/>
					</div>
					<div className="form-label date">
						<label htmlFor="deadlineDate">Tender Project Deadline Date:</label>
						<input
							className="form-input"
							type="date"
							id="deadlineDate"
							value={deadlineDate}
							onChange={handleDeadlineDateChange}
							required
						/>
					</div>
					<div className="form-label skills-dropdown">
						<label htmlFor="skills">Skills Required:</label>
						<Select
							className="input-form select"
							options={options}
							value={selectedSkills}
							onChange={handleChange}
							isMulti
						></Select>
					</div>
					<button className="form-btn" type="submit">
						Publish Tender
					</button>
				</form>
			</div>
		</main>
	);
};

export default PublishTenderForm;
