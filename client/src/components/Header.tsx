import { Button } from "@/components/ui/button";
import { User, Warehouse, LogOut } from "lucide-react";
import { NavLink } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/api/auth";

function Header() {
  const { isAuthenticated, user } = useAuth();
  const logout = useLogout();
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
              to="/browse"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Browse                
            </NavLink>
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
          {!isAuthenticated ? (
            <>
              <Button variant="ghost">
                <NavLink to="/login" className="cursor-pointer">
                  Log In
                </NavLink>
              </Button>

              <Button variant="ghost">
                <NavLink to="/signup" className="cursor-pointer">
                  Sign Up
                </NavLink>
              </Button>
            </>
          ) : (
            <>
              {user && !user.confirmed && (
                <span className="text-sm text-orange-500 font-medium">
                  ⚠️ Verify your email
                </span>
              )}

              <Button>
                <NavLink to="/items" className="cursor-pointer">
                  My Items
                </NavLink>
              </Button>

              <NavLink to={`/profiles/${user?.id}`} className="cursor-pointer">
                <Button className="cursor-pointer" variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </NavLink>

              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
