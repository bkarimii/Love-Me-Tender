import { Route, Routes } from "react-router-dom";

import About from "./pages/About";
import Home from "./pages/Home";
import LogInForm from "./pages/LogInForm";
import SignUp from "./pages/SignUp";

const App = () => (
	<Routes>
		<Route path="/" element={<Home />} />
		<Route path="/about/this/site" element={<About />} />
		<Route path="/login" element={<LogInForm />} />
		<Route path="/signup" element={<SignUp />} />
	</Routes>
);

export default App;
