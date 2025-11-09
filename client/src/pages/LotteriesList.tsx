import { Button } from "@/components/ui/button";
import { NavLink } from "react-router";

function LotteriesList() {
    return (
        <div>
            <h1>Lotteries List Page</h1>
            <Button>
                <NavLink to="/lotterystats">
                    Lottery stats
                </NavLink>
            </Button>
        </div>
  );
}

export default LotteriesList;