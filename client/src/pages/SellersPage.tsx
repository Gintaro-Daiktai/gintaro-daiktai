import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Loader2, Search } from "lucide-react";
import { NavLink } from "react-router";
import { useState, useMemo } from "react";
import { useAllSellers } from "@/api/auth";
import { createSafeAvatarDataUri } from "@/utils/imageValidation";

export default function SellersPage() {
  const { data: sellers, isLoading, isError } = useAllSellers();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSellers = useMemo(() => {
    if (!sellers) return [];

    if (!searchQuery.trim()) return sellers;

    const query = searchQuery.toLowerCase();
    return sellers.filter(
      (seller) =>
        seller.name.toLowerCase().includes(query) ||
        seller.last_name.toLowerCase().includes(query) ||
        `${seller.name} ${seller.last_name}`.toLowerCase().includes(query),
    );
  }, [sellers, searchQuery]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="flex-1 py-8">
      <div className="container mx-auto">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Sellers</h1>
            <p className="text-muted-foreground">
              Browse all sellers on Gintaro Daiktai
            </p>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search sellers by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-destructive">Failed to load sellers</p>
            </div>
          ) : filteredSellers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No sellers found matching your search"
                  : "No sellers found"}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {filteredSellers.length}
                </span>{" "}
                {filteredSellers.length === 1 ? "seller" : "sellers"}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSellers.map((seller) => {
                  const avatarSrc = seller.avatar
                    ? createSafeAvatarDataUri(seller.avatar)
                    : undefined;

                  return (
                    <NavLink
                      key={seller.id}
                      to={`/profiles/${seller.id}`}
                      className="block"
                    >
                      <Card className="group overflow-hidden hover:shadow-lg transition-shadow h-full">
                        <CardContent className="p-6 space-y-4">
                          <div className="flex flex-col items-center space-y-3">
                            <div className="relative">
                              {avatarSrc ? (
                                <img
                                  src={avatarSrc}
                                  alt={`${seller.name} ${seller.last_name}`}
                                  className="h-20 w-20 rounded-full object-cover border-2 border-border group-hover:border-primary transition-colors"
                                />
                              ) : (
                                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border-2 border-border group-hover:border-primary transition-colors">
                                  <User className="h-10 w-10 text-muted-foreground" />
                                </div>
                              )}
                            </div>

                            <div className="text-center space-y-1">
                              <h3 className="font-semibold text-lg">
                                {seller.name} {seller.last_name}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                Member since{" "}
                                {formatDate(seller.registration_date)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </NavLink>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
