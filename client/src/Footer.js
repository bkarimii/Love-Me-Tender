import "./Footer.css";
import Logo from "./assets/images/CTY-logo-rectangle.png";

const Footer = () => {
	return (
		<footer className="footer">
			<img className="footer-logo" src={Logo} alt="Logo" />
			<p>© 2024 CYF. All rights reserved.</p>
		</footer>
	);
};

export default Footer;
