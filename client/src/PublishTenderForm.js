import React, { useState, useEffect } from "react";
import "./styles.css";

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
		fetch("/api/skills")
			.then((response) => response.json())
			.then((data) => {
				setSkills(data.skills);
				setErrors([]);
			})
			.catch(() => {
				setErrors(["Failed to fetch skills. Please try again later."]);
			});
	}, []);

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

	const handleSkillsChange = (event) => {
		const options = event.target.options;
		const selectedSkills = [];
		for (const option of options) {
			if (option.selected) {
				selectedSkills.push(option.value);
			}
		}
		setSelectedSkills(selectedSkills);
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
					selectedSkills,
				};

				const response = await fetch("/api/publish-tenders", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.error || "Failed to publish tender.");
				}

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
		<main className="container">
			<h1>Publish Tender</h1>
			{errors.length > 0 && (
				<div className="error-message">
					<ul>
						{errors.map((error, index) => (
							<li key={index}>{error}</li>
						))}
					</ul>
				</div>
			)}
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="title">Tender Title:</label>
					<input
						type="text"
						id="title"
						value={title}
						onChange={handleTitleChange}
						maxLength="50"
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="description">Tender Description:</label>
					<textarea
						id="description"
						value={description}
						onChange={handleDescriptionChange}
						maxLength="7500"
						required
					></textarea>
				</div>
				<div className="form-group">
					<label htmlFor="announcementDate">Tender Announcement Date:</label>
					<input
						type="date"
						id="announcementDate"
						value={announcementDate}
						onChange={handleAnnouncementDateChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="closingDate">Tender Closing Date:</label>
					<input
						type="date"
						id="closingDate"
						value={closingDate}
						onChange={handleClosingDateChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="deadlineDate">Tender Project Deadline Date:</label>
					<input
						type="date"
						id="deadlineDate"
						value={deadlineDate}
						onChange={handleDeadlineDateChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="skills">Skills Required:</label>
					<select
						id="skills"
						multiple
						value={selectedSkills}
						onChange={handleSkillsChange}
						required
					>
						{skills.map((skill) => (
							<option key={skill} value={skill}>
								{skill}
							</option>
						))}
					</select>
				</div>
				<button type="submit">Publish Tender</button>
			</form>
		</main>
	);
};

export default PublishTenderForm;
