import Logo from "./assets/images/CTY-logo-rectangle.png";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { post } from "./TenderClient";

import "./Header.css";

const Header = () => {
	const [role, setRole] = useState(localStorage.getItem("userType") || null);
	const [errMsg, setErrMsg] = useState(null);
	const navigate = useNavigate();
	const location = useLocation();

	console.log(location, "location");

	useEffect(() => {
		const storageEventHandler = () => {
			setRole(localStorage.getItem("userType"));
		};

		window.addEventListener("storage", storageEventHandler);

		return () => {
			window.removeEventListener("storage", storageEventHandler);
		};
	}, []);

	const handleLogout = async (e) => {
		e.preventDefault();
		try {
			const response = await post("/api/logout");

			if (response) {
				localStorage.removeItem("authToken");
				localStorage.removeItem("userType");
				navigate("/");
				setRole(null);
			} else {
				setErrMsg("Logout failed");
			}
		} catch (error) {
			setErrMsg("Failed to logout. Try again!");
		}
	};

	if (errMsg != null) {
		<div>Error: {errMsg}</div>;
	}

	return (
		<header className="header">
			<a href="/">
				<img className="logo" src={Logo} alt="Code Your Future logo" />
			</a>
			{role != null && (
				<nav className="nav-list">
					{role === "admin" && (
						<>
							<NavLink
								exact
								to="/dashboard"
								className="nav-link"
								activeClassName="active"
							>
								All Tenders
							</NavLink>
							<NavLink
								exact
								to="/grant-access"
								className="nav-link"
								activeClassName="active"
							>
								Grant Access
							</NavLink>
							<NavLink
								exact
								to="/"
								className="nav-link"
								activeClassName="active"
								onClick={handleLogout}
							>
								Logout
							</NavLink>
						</>
					)}

					{role === "buyer" && (
						<>
							<NavLink
								exact
								to="/dashboard"
								className="nav-link"
								activeClassName="active"
							>
								All Tenders
							</NavLink>
							<NavLink
								exact
								to="/buyer-tender"
								className="nav-link"
								activeClassName="active"
							>
								My Tenders
							</NavLink>
							<NavLink
								exact
								to="/publish-tender"
								className="nav-link"
								activeClassName="active"
							>
								Publish Tenders
							</NavLink>
							<NavLink
								exact
								to="/"
								className="nav-link"
								activeClassName="active"
								onClick={handleLogout}
							>
								Logout
							</NavLink>
						</>
					)}

					{role === "bidder" && (
						<>
							<NavLink
								exact
								to="/dashboard"
								className="nav-link"
								activeClassName="active"
							>
								All Tenders
							</NavLink>
							<NavLink
								exact
								to="/bidder-biddings"
								className="nav-link"
								activeClassName="active"
							>
								My bids
							</NavLink>
							<NavLink
								exact
								to="/"
								className="nav-link"
								activeClassName="active"
								onClick={handleLogout}
							>
								Logout
							</NavLink>
						</>
					)}
				</nav>
			)}
		</header>
	);
};

export default Header;
