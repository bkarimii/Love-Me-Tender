import "./Footer.css";
import Logo from "./assets/images/CTY-logo-rectangle.png";

const Footer = () => {
	return (
		<footer className="footer">
			<img className="footer-logo" src={Logo} alt="Logo" />
			<ul className="footer-list">
				<a className="footer-link" href="/">
					ABOUT US
				</a>
				<a className="footer-link" href="/">
					CONTACT
				</a>
				<a className="footer-link" href="/">
					PRIVACY POLICY
				</a>
				<a className="footer-link" href="/">
					TERMS OF SERVICE
				</a>
			</ul>
		</footer>
	);
};

export default Footer;
