import "./App.css";
import { Route, Routes } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import HomePage from "./pages/HomePage";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import BrowsePage from "./pages/BrowsePage";
import AuctionStatisticsPage from "./pages/AuctionStatisticsPage";
import AuctionsList from "./pages/AuctionsList";
import DeliveryStatisticsPage from "./pages/DeliveryStatisticsPage";
import LotteryStatisticsPage from "./pages/LotteryStatisticsPage";
import LotteriesList from "./pages/LotteriesList";
import UserStatisticsPage from "./pages/UserStatisticsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ItemPage from "./pages/ItemPage";
import LotteryPage from "./pages/LotteryPage";
import LotteriesPage from "./pages/LotteriesPage";
import LotteryCreationPage from "./pages/LotteryCreationPage";
import ProfilePage from "./pages/ProfilePage";
import ReviewPage from "./pages/CreateReviewPage";
import UserDeliveriesPage from "./pages/UserDeliveriesPage";
import DeliveryPage from "./pages/DeliveryPage";
import DisputeFormPage from "./pages/DisputeFormPage";
import UserMessagingPage from "./pages/UserMessagingPage";
import MyItemsPage from "./pages/ItemsPage";
import LotteryEditPage from "./pages/LotteryEditPage";
import ChargebackPage from "./pages/ChargebackPage";
import AuctionsPage from "./pages/AuctionsPage";
import AuctionPage from "./pages/AuctionPage";

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
      <Route path="/auctionstats/:id" element={<AuctionStatisticsPage params={{id: "1"}} />} />
      <Route path="/auctionslist" element={<AuctionsList />} />
      <Route path="/deliverystats/" element={<DeliveryStatisticsPage params={{id: "1"}} />} />
      <Route path="/lotterystats/:id" element={<LotteryStatisticsPage params={{id: "1"}} />} />
      <Route path="/lotterieslist" element={<LotteriesList />} />
      <Route path="/userstats" element={<UserStatisticsPage />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/auctions" element={<AuctionsPage />} />
      <Route path="/auction/:id" element={<AuctionPage />} />
      <Route path="/items" element={<MyItemsPage />} />
      <Route path="/lotteries" element={<LotteriesPage />} />
      <Route path="/lottery/create" element={<LotteryCreationPage />} />
      <Route path="/lottery/:id" element={<LotteryPage />} />
      <Route path="/lottery/:id/edit" element={<LotteryEditPage />} />
      <Route path="/lottery/:id/item/:id" element={<ItemPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profiles/:userId" element={<ProfilePage />} />
      <Route path="/review/create" element={<ReviewPage />} />
      <Route path="/deliveries" element={<UserDeliveriesPage />} />
      <Route path="/deliveries/:id" element={<DeliveryPage />} />
      <Route
        path="/deliveries/:id/dispute"
        element={<DisputeFormPage params={{ id: "1" }} />}
      />
      <Route path="/messages" element={<UserMessagingPage />} />
      <Route
        path="/admin/chargebacks"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ChargebackPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
