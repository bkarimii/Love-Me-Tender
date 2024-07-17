import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PublishTenderForm from "./PublishTenderForm";

const App = () => (
	<Routes>
		<Route path="/" element={<Home />} />
		<Route path="/publish-tender" element={<PublishTenderForm />} />
	</Routes>
);

export default App;
