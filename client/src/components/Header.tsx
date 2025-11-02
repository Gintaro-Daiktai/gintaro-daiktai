import { Button } from "@/components/ui/button";
import { User, Warehouse } from "lucide-react";
import { NavLink } from "react-router";

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2">
            <Warehouse className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Gintaro Daiktai</span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
            <a
              href="/browse"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Browse
            </a>
            <a
              href="/auctions"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Auctions
            </a>
            <a
              href="/lotteries"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Lotteries
            </a>
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
            <a className="cursor-pointer">Sell Item</a>
          </Button>

          <Button className="cursor-pointer" variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
