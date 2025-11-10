import { Button } from "@/components/ui/button";
import { User, Warehouse } from "lucide-react";
import { NavLink } from "react-router";

function Header() {
  //placeholder for current user id
  const CURRENT_USER_ID = "1";
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2">
            <Warehouse className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Gintaro Daiktai</span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
            <NavLink
              to="/auctions"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Auctions
            </NavLink>
            <NavLink
              to="/lotteries"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Lotteries
            </NavLink>
            <NavLink
              to="/admin/chargebacks"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Chargebacks
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost">
            <NavLink to={"/login"} className="cursor-pointer">
              Log In
            </NavLink>
          </Button>

          <Button variant="ghost">
            <NavLink to={"/signup"} className="cursor-pointer">
              Sign Up
            </NavLink>
          </Button>

          <Button>
            <NavLink to={"/items"} className="cursor-pointer">
              My Items
            </NavLink>
          </Button>

          <NavLink
            to={`/profiles/${CURRENT_USER_ID}`}
            className="cursor-pointer"
          >
            <Button className="cursor-pointer" variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Header;
