import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Gavel, User, Heart, Bell } from "lucide-react";

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2">
            <Gavel className="h-6 w-6 text-primary" />
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
              href="/how-it-works"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Auctions
            </a>
            <a
              href="/how-it-works"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Lotteries
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search auctions..." className="pl-9 w-full" />
            </div>
          </div>

          <Button variant="ghost">
            <a>LogIn</a>
          </Button>

          <Button variant="ghost">
            <a>SignUp</a>
          </Button>

          <Button><a>Sell Item</a></Button>

          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
