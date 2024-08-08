import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PublishTenderForm from "./PublishTenderForm";
import BuyerTenderList from "./BuyerTenderList";
import BidderBiddingList from "./BidderBiddingList";
import GrantAccessForm from "./pages/GrantAccessForm";
import Dashboard from "./pages/Dashboard";
import TendersList from "./TenderList";
import Header from "./Header";
import Footer from "./Footer";
import ProtectedRoute from "./ProtectedRoute";
import BidList from "./BidList";
import SubmitBidForm from "./SubmitBidForm";

const App = () => (
	<>
		<Header className="header" />
		<Routes>
			<Route
				path="/"
				element={
					<ProtectedRoute>
						<Home />
					</ProtectedRoute>
				}
			/>
			<Route path="/publish-tender" element={<PublishTenderForm />} />
			<Route path="/buyer-tender" element={<BuyerTenderList />} />
			<Route
				path="/buyer-tender/page/:pageNumber"
				element={<BuyerTenderList />}
			/>
			<Route path="/bidder-biddings" element={<BidderBiddingList />} />
			<Route path="/grant-access" element={<GrantAccessForm />} />
			<Route path="/dashboard" element={<Dashboard />} />
			<Route path="/dashboard/page/:pageNumber" element={<TendersList />} />
			<Route path="/bidding/:tenderId" element={<BidList />} />
			<Route path="/tenders/:tenderId/submit-bid" element={<SubmitBidForm />} />
		</Routes>
		<Footer className="footer" />
	</>
);

export default App;
