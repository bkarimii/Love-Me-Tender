import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PublishTenderForm from "./PublishTenderForm";
import BuyerTenderList from "./BuyerTenderList";
import BidderBiddingList from "./BidderBiddingList";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import TendersList from "./TenderList";
import Header from "./Header";
import Footer from "./Footer";

const App = () => (
	<>
		<Header className="header" />
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/publish-tender" element={<PublishTenderForm />} />
			<Route path="/BuyerTenderList" element={<BuyerTenderList />} />
			<Route path="/BidderBiddingList" element={<BidderBiddingList />} />
			<Route path="/signup" element={<SignUp />} />
			<Route path="/dashboard" element={<Dashboard />} />
			<Route path="/dashboard/page/:pageNumber" element={<TendersList />} />
		</Routes>
		<Footer className="footer" />
	</>
);

export default App;
