import "./App.css";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import BrowsePage from "./pages/BrowsePage";
import AuctionStatisticsPage from "./pages/AuctionStatisticsPage";
import DeliveryStatisticsPage from "./pages/DeliveryStatisticsPage";
import LotteryStatisticsPage from "./pages/LotteryStatisticsPage";
import UserStatisticsPage from "./pages/UserStatisticsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ItemPage from "./pages/ItemPage";
import LotteryPage from "./pages/LotteryPage";
import LotteriesPage from "./pages/LotteriesPage";
import CreateLotteryPage from "./pages/CreateLotteryPage";
import ProfilePage from "./pages/ProfilePage";
import UserDeliveriesPage from "./pages/UserDeliveriesPage";
import DeliveryPage from "./pages/DeliveryPage";
import DisputeFormPage from "./pages/DisputeFormPage";
import UserMessagingPage from "./pages/UserMessagingPage";
import AuctionsPage from "./pages/AuctionsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <h1>Admin Page</h1>
          </ProtectedRoute>
        }
      ></Route>
      <Route path="/login" element={<LogInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/auctionstats" element={<AuctionStatisticsPage />} />
      <Route path="/deliverystats" element={<DeliveryStatisticsPage />} />
      <Route path="/lotterystats" element={<LotteryStatisticsPage />} />
      <Route path="/userstats" element={<UserStatisticsPage />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/lotteries" element={<LotteriesPage />} />
      <Route path="/lottery/create" element={<CreateLotteryPage />} />
      <Route path="/lottery/:id" element={<LotteryPage />} />
      <Route path="/lottery/:id/item/:id" element={<ItemPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profiles/:userId" element={<ProfilePage />} />
      <Route path="/deliveries" element={<UserDeliveriesPage />} />
      <Route path="/auctions" element={<AuctionsPage />} />
      <Route path="/deliveries/:id" element={<DeliveryPage params={{
        id: "1"
      }} />} />
      <Route path="/deliveries/:id/dispute" element={<DisputeFormPage params={{id:"1"}} />} />
      <Route path="/messages" element={<UserMessagingPage searchParams={{ userId: "current-user" }} />}  />
    </Routes>
  );
}

export default App;
