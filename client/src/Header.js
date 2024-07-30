import Logo from "./assets/images/CTY-logo-rectangle.png";
import { NavLink } from "react-router-dom";
import "./Header.css";

const Header = () => {
	return (
		<header className="header">
			<img className="logo" src={Logo} alt="Code Your Future logo" />
			<nav className="nav-list">
				<li>
					<NavLink exact to="/" className="nav-link" activeClassName="active">
						Home{" "}
					</NavLink>
				</li>
				<li>
					<NavLink
						exact
						to="/list-tenders"
						className="nav-link"
						activeClassName="active"
					>
						All Tenders{" "}
					</NavLink>
				</li>
			</nav>
		</header>
	);
};

export default Header;
