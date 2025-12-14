import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Edit,
  Clock,
  Ticket,
  Gavel,
  Trash2,
  EditIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import type { CreateItemDto, Item, UpdateItemDto } from "@/types/item";
import { itemApi, useDeleteItem, useUpdateItem } from "@/api/item";
import { EditItemDialog } from "@/components/item/EditItemDialog";
import { CreateItemDialog } from "@/components/item/CreateItemDialog";
import type { Tag } from "@/types/tag";
import { tagApi } from "@/api/tag";
import { imageApi } from "@/api/image";

export default function MyItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({});
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchItems = async (): Promise<Item[]> => {
    try {
      return itemApi.getItems();
    } catch (err) {
      let errorMessage = "An unknown error occurred while fetching items.";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      console.error("Failed to fetch items:", err);
      setErrors((prevErrors) => [...prevErrors, errorMessage]);
      return [];
    }
  };

  const fetchTags = async (): Promise<Tag[]> => {
    try {
      return tagApi.getTags();
    } catch (err) {
      let errorMessage = "An unknown error occurred while fetching tags.";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      console.error("Failed to fetch tags:", err);
      setErrors((prevErrors) => [...prevErrors, errorMessage]);
      return [];
    }
  };

  const fetchImages = async (
    itemsToLoad: Item[],
  ): Promise<Record<number, string>> => {
    const urls: Record<number, string> = {};

    await Promise.all(
      itemsToLoad.map(async (item) => {
        if (item.image) {
          try {
            urls[item.id] = await imageApi.getImageById(item.image.id);
          } catch (err) {
            console.error(`Failed to load image for item ${item.id}`, err);
          }
        }
      }),
    );

    return urls;
  };

  const fetchData = async () => {
    setLoading(true);
    setErrors([]);

    const items = await fetchItems();
    setItems(items);
    const tags = await fetchTags();
    setTags(tags);
    const images = await fetchImages(items);
    setImageUrls(images);

    setLoading(false);
  };

  const updateItemMutation = useUpdateItem();
  const deleteItemMutation = useDeleteItem();

  const handleItemCreate = async (
    createItemDto: CreateItemDto,
    imageFile: File,
  ) => {
    await itemApi.createItem(createItemDto, imageFile);
    await fetchData();
  };

  const handleItemUpdate = async (
    itemId: number,
    updateItemDto: UpdateItemDto,
    imageFile?: File,
  ) => {
    await updateItemMutation.mutateAsync({ itemId, updateItemDto, imageFile });
    await fetchData();
  };

  const handleItemDelete = async (itemId: number) => {
    await deleteItemMutation.mutateAsync(itemId);
    await fetchData();
  };

  const myAuctions = [
    {
      id: 1,
      title: "Mid-Century Modern Chair",
      currentBid: 1850,
      endTime: "Ended",
      status: "draft",
      image: "/chair.jpeg",
    },
  ];

  const myLotteries = [
    {
      id: 1,
      title: "MacBook Pro M3 Max Giveaway",
      ticketsSold: 342,
      totalTickets: 500,
      status: "draft",
      image: "/macbook.jpg",
    },
  ];

  if (loading) return <p></p>;

  if (errors.length > 0) {
    return (
      <div className="color-red, p-10">
        <h4>Data Fetching Failed:</h4>
        {errors.map((err, index) => (
          <p key={index} style={{ margin: "5px 0" }}>
            {err}
          </p>
        ))}
      </div>
    );
  } else {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <div className="border-b bg-muted/30">
            <div className="container py-8">
              <h1 className="text-3xl font-bold tracking-tight">My Items</h1>
              <p className="text-muted-foreground mt-2">
                Manage your items, auctions, and lotteries
              </p>
            </div>
          </div>

          <div className="container py-8 space-y-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">My Items</CardTitle>
                <CreateItemDialog
                  availableTags={tags}
                  onSave={handleItemCreate}
                >
                  <Button className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Item
                  </Button>
                </CreateItemDialog>
              </CardHeader>

              <CardContent>
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      No items yet...
                    </p>
                    <CreateItemDialog
                      availableTags={tags}
                      onSave={handleItemCreate}
                    >
                      <Button className="cursor-pointer">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Item
                      </Button>
                    </CreateItemDialog>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                      <Card
                        key={item.id}
                        className="p-0 group overflow-hidden hover:shadow-lg transition-shadow text-left cursor-pointer gap-0"
                      >
                        <div className="relative aspect-4/3 overflow-hidden bg-muted cursor-pointer">
                          <img
                            src={imageUrls[item.id] || "/placeholder.svg"}
                            alt={item.name}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardContent className="p-4 space-y-4">
                          <h3 className="font-semibold line-clamp-2 leading-snug cursor-pointer hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                          <p className="line-clamp-2 leading-snug cursor-pointer">
                            {item.description}
                          </p>
                          <div className="flex justify-end-safe gap-2">
                            <EditItemDialog
                              currentItem={item}
                              availableTags={tags}
                              onSave={handleItemUpdate}
                              onDelete={handleItemDelete}
                            >
                              <Button
                                className="cursor-pointer"
                                variant={"outline"}
                              >
                                <EditIcon className="h-4 w-4" />
                                Edit
                              </Button>
                            </EditItemDialog>
                            <Button
                              className="cursor-pointer text-red-500"
                              variant={"outline"}
                              onClick={() => handleItemDelete(item.id)}
                            >
                              <Trash2Icon className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* My Auctions Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">My Auctions</CardTitle>
                <div className="flex gap-2">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Auction
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {myAuctions.length === 0 ? (
                  <div className="text-center py-12">
                    <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No auctions yet
                    </p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Auction
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myAuctions.map((auction) => (
                      <div
                        key={auction.id}
                        className="flex items-center gap-4 p-4 border rounded-lg text-left"
                      >
                        <img
                          src={auction.image || "/placeholder.svg"}
                          alt={auction.title}
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">
                            {auction.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">
                                Current Bid
                              </p>
                              <p className="font-semibold text-primary">
                                ${auction.currentBid.toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {auction.endTime}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              auction.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {auction.status}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="cursor-pointer"
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive cursor-pointer"
                          >
                            <Trash2 className="mr-1 h-3 w-3 hover:tex" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* My Lotteries Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">My Lotteries</CardTitle>
                <Button asChild>
                  <NavLink to="/lottery/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Lottery
                  </NavLink>
                </Button>
              </CardHeader>
              <CardContent>
                {myLotteries.length === 0 ? (
                  <div className="text-center py-12">
                    <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No lotteries yet
                    </p>
                    <Button asChild>
                      <NavLink to="/lottery/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Lottery
                      </NavLink>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myLotteries.map((lottery) => (
                      <div
                        key={lottery.id}
                        className="flex items-center gap-4 p-4 border rounded-lg text-left"
                      >
                        <img
                          src={lottery.image || "/placeholder.svg"}
                          alt={lottery.title}
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">
                            {lottery.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">
                                Tickets Sold
                              </p>
                              <p className="font-semibold">
                                {lottery.ticketsSold} / {lottery.totalTickets}
                              </p>
                            </div>
                            <div className="flex-1 max-w-xs">
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-accent"
                                  style={{
                                    width: `${(lottery.ticketsSold / lottery.totalTickets) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              lottery.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {lottery.status}
                          </span>
                          {lottery.status === "draft" ? (
                            <Button size="sm" variant="outline" asChild>
                              <NavLink to={`/lottery/${lottery.id}/edit`}>
                                <Edit className="mr-1 h-3 w-3" />
                                Edit
                              </NavLink>
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="cursor-pointer"
                              asChild
                            >
                              <NavLink to={`/lottery/${lottery.id}`}>
                                View
                              </NavLink>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive cursor-pointer"
                          >
                            <Trash2 className="mr-1 h-3 w-3 hover:tex" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }
}
