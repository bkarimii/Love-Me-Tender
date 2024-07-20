import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PublishTenderForm from "./PublishTenderForm";
import SignUp from "./pages/SignUp";

const App = () => (
	<Routes>
		<Route path="/" element={<Home />} />
		<Route path="/publish-tender" element={<PublishTenderForm />} />
		<Route path="/signup" element={<SignUp />} />
	</Routes>
);

export default App;
