import { Gavel } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Gavel className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Gintaro Daiktai</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The trusted marketplace for buying and selling unique items
              through secure online auctions.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/browse"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Browse Auctions
                </a>
              </li>
              <li>
                <a
                  href="/categories"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Categories
                </a>
              </li>
              <li>
                <a
                  href="/trending"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Trending Items
                </a>
              </li>
              <li>
                <a
                  href="/ending-soon"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Ending Soon
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Gintaro Daiktai. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
