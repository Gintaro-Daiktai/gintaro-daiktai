import { Button } from "@/components/ui/button";
import { NavLink } from "react-router";

function AuctionsList() {
    return (
        <div>
            <h1>Auctions List Page</h1>
            <Button>
                <NavLink to="/auctionstats">
                    Auction stats
                </NavLink>
            </Button>
        </div>
  );
}

export default AuctionsList;